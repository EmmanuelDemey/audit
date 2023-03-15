import { mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { simpleGit, SimpleGit } from 'simple-git';


// DOMAIN 
type RuleResult = { valid: boolean; categories: CATEGORIES[]; links?: string[] };
interface PageAuditResult {
  title?: string;
  lang?: string;
  rulesResult?: { [ruleName: string]: RuleResult };
}

type AuditResults = { [url: string]: PageAuditResult };

enum CATEGORIES {
  ACCESSIBILITY = 'ACCESSIBILITY',
}

interface Audit {
  audit: (urls: string[]) => Promise<PageAuditResult>
}

class PageAudit implements Audit  {
    constructor(private readonly scrapper: WebPageScrapper, private readonly codeFetcher: CodeFetcher, private readonly outputs: Output[]) {}
  
    private async auditExternalWebPage() {
      const pageAuditResult: PageAuditResult = {};
      
      pageAuditResult.title = await this.scrapper.getHomePageTitle();
      pageAuditResult.lang = await this.scrapper.getLang();
  
      const results: { [ruleName: string]: RuleResult } = await Promise.all(
        rules.map((rule) => rule(this.scrapper))
      ).then((results) => {
        return results.reduce((acc, result, index) => {
          return {
            ...acc,
            [rules[index].name]: result,
          };
        }, {});
      });
  
      pageAuditResult.rulesResult = results;
  


      return pageAuditResult;
    }
    async audit(urls: string[]) {
      const codePath = await this.codeFetcher.fetch();
      console.log(codePath)

      const results: AuditResults = {};

      for(const url of urls){
        await this.scrapper.visit(url);
        results[url] = await this.auditExternalWebPage();
      }
      
      this.outputs.forEach(output => output.convert(results))

      return results;
    }
  }

const checkTitle = async (scrapper: WebPageScrapper): Promise<RuleResult> => {
  const title = await scrapper.getHomePageTitle();
  return {
    valid: !!title,
    categories: [CATEGORIES.ACCESSIBILITY],
    links: ['https://www.w3.org/WAI/WCAG21/Understanding/page-titled'],
  };
};

const checkHeadingWithAlertOrStatusAriaRole = async (
  scrapper: WebPageScrapper
): Promise<RuleResult> => {
  let selector = '';
  for (let i = 1; i <= 6; i++) {
    selector += `h${i}[role='status'],h${i}1[role='alert']`;
    if (i !== 6) {
      selector += ',';
    }
  }
  const headers = await scrapper.querySelectorAll(selector);
  return {
    valid: headers.length === 0,
    categories: [CATEGORIES.ACCESSIBILITY],
    links: [],
  };
};

const rules: Array<(scrapper: WebPageScrapper) => Promise<RuleResult>> = [
  checkTitle,
  checkHeadingWithAlertOrStatusAriaRole,
];

// Infrastructure
interface WebPageScrapper {
  visit: (url: string) => void;
  getHomePageTitle: () => Promise<string>;
  getLang: () => Promise<string>;
  querySelectorAll: (selector: string) => Promise<Element[]>;
  tearDown: () => void;
}

class PuppeteerPageScrapper implements WebPageScrapper {
  private browser: Browser | null;
  tab: Page;

  async getInstance() {
    if (this.browser !== null) {
      this.browser = await puppeteer.launch();
    }
    return this.browser;
  }

  async visit(url: string) {
    await this.getInstance();
    this.tab = await this.browser.newPage();
    await this.tab.goto(url);
  }

  getHomePageTitle(): Promise<string> {
    return this.tab.title();
  }
  getLang(): Promise<string> {
    return this.tab.evaluate(() =>
      document.querySelector('html').getAttribute('lang')
    );
  }
  querySelectorAll(selector: string): Promise<Element[]> {
    return this.tab.evaluate(
      (selector) => Array.from(document.querySelectorAll(selector)),
      selector
    );
  }
  tearDown(): void {
    this.browser.close();
  }
}


interface CodeFetcher {
  fetch: () => Promise<string>;
}

class GitCodeFetcher implements CodeFetcher {
  private readonly tempFolder = './.tmp';
  private git: SimpleGit;

  constructor(private readonly url: string){
    rmSync(this.tempFolder, { recursive: true, force: true});
    mkdirSync(this.tempFolder, { recursive: true})
    this.git = simpleGit();
  }
  fetch(): Promise<string> {
    return this.git.clone(this.url, this.tempFolder, {
      '--depth': 1,
    });
  }
}

interface Output {
  convert: (result: AuditResults) => void;
}




interface AuditConfig {
  githubUrl: string,
  urls: string[],
  outputs: Output[]
}
(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config: AuditConfig = require(resolve(process.cwd(), 'audit.config.js'));
  const codeFetcher = new GitCodeFetcher(config.githubUrl);
  const scrapper = new PuppeteerPageScrapper();
  const auditor = new PageAudit(scrapper, codeFetcher, config.outputs ?? []);
  await auditor.audit(config.urls);
  scrapper.tearDown();
  process.exit(0);
})();
