import { exporterLogger } from '@audit/exporter-logger';
import { mkdirSync } from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer';
import { simpleGit } from 'simple-git';


// DOMAIN 
type RuleResult =
  | boolean
  | { valid: boolean; categories: CATEGORIES[]; links?: string[] };
interface PageAuditResult {
  title?: string;
  lang?: string;
  rulesResult?: { [ruleName: string]: RuleResult };
}

type AuditResults = { [url: string]: PageAuditResult };

enum CATEGORIES {
  ACCESSIBILITY = 'ACCESSIBILITY',
}

class PageAudit {
    constructor(private readonly scrapper: WebPageScrapper) {}
  
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
    async audit(url: string) {
      const results: AuditResults = {};
      await this.scrapper.visit(url);
      results[url] = await this.auditExternalWebPage();
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



(async () => {
  mkdirSync('./.tmp', { recursive: true });
  const git = simpleGit();
  git.clone('https://github.com/EmmanuelDemey/audit', './.tmp', {
    '--depth': 1,
  });

  const scrapper = new PuppeteerPageScrapper();
  const url = 'https://www.emmanueldemey.dev/';
  const auditor = new PageAudit(scrapper);
  const results = await auditor.audit(url);
  scrapper.tearDown();

  exporterLogger(JSON.stringify(results));
  process.exit(0);
})();
