import { mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';
import puppeteer, { Browser, Page, SerializedAXNode } from 'puppeteer';
import { simpleGit, SimpleGit } from 'simple-git';
import { PageAudit } from '@audit/domain';
import { WebPageScrapper, CodeFetcher, AuditConfig } from '@audit/model';


class PuppeteerPageScrapper implements WebPageScrapper {
  
  private browser: Browser | null;
  tab: Page;

  async getInstance() {
    if (this.tab !== null) {
      this.browser = await puppeteer.launch();
      this.tab = await this.browser.newPage();
    }
    return this.tab;
  }

  

  async getLinks(url: string): Promise<string[]>{
    await this.getInstance();
    await this.tab.goto(url)
    
    return this.tab.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href]")).map((link: HTMLLinkElement) => link.href);
    })
  }
  async visit(url: string) {
    await this.getInstance();
    await this.tab.goto(url);
  }

  async getAccessibilityTree(): Promise<SerializedAXNode> {
    return this.tab.accessibility.snapshot()
  }

  getHomePageTitle(): Promise<string> {
    return this.tab.title();
  }
  getLang(): Promise<string> {
    return this.tab.evaluate(() =>
      document.querySelector('html').getAttribute('lang')
    );
  }
  getExternalJavaScript(): Promise<string[]> {
    return this.tab.evaluate(() =>
      Array.from(document.querySelectorAll('script')).map((script: HTMLScriptElement) => script.src)
    );
  }
  getExternalCSS(): Promise<string[]> {
    return this.tab.evaluate(() =>
      Array.from(document.querySelectorAll('link')).map((script: HTMLLinkElement) => script.href)
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


(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config: AuditConfig = require(resolve(process.cwd(), 'audit.config.js'));
  const codeFetcher = new GitCodeFetcher(config.githubUrl);
  const scrapper = new PuppeteerPageScrapper();
  const auditor = new PageAudit(scrapper, codeFetcher, config.outputs ?? []);
  await auditor.audit(config);
  scrapper.tearDown();
  process.exit(0);
})();
