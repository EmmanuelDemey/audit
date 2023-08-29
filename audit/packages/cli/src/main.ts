import { mkdirSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import puppeteer, { Browser, Page, SerializedAXNode } from 'puppeteer';
import { simpleGit, SimpleGit } from 'simple-git';
import { PageAudit } from '@audit/domain';
import { WebPageScrapper, CodeFetcher, AuditConfig, FileSystemScrapper, PACKAGE_MANAGER } from '@audit/model';
import { existsSync } from 'fs';
import { text } from '@clack/prompts';

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
    //this.browser.close();
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
  async fetch(): Promise<string> {
    await this.git.clone(this.url, this.tempFolder, {
      '--depth': 1,
    });
    return this.tempFolder;
  }
}



class DefaultFileSystemScrapper implements FileSystemScrapper {
  getPackageManager(root: string): Promise<PACKAGE_MANAGER> {

    
  return Promise.resolve([
      ['package-lock.json', 'npm'],
      ['yarn.lock', 'yarn'],
      ['pnpm-lock.yaml', 'pnpm'],
      ['pom.xml', 'maven'],
      ['build.gradle', 'gradle']
    ].find(([file]) => existsSync(join(root, file)))?.[1] as PACKAGE_MANAGER)
  }
  isFileExisting(path: string): Promise<boolean> {
    return Promise.resolve(existsSync(path));
  }
}

(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configurationFile = resolve(process.cwd(), 'audit.config.js2');

  let config: Partial<AuditConfig> = {};
  if(existsSync(configurationFile)){
    config = require(configurationFile);
  } else {

    const url = await text({
      message: "URL of the website you want to audit"
    });
    config.urls = [url as string];

    const githubUrl = await text({
      message: "URL vers le repository Git"
    });
    config.githubUrl = githubUrl as string;
    config.excludes = []
  }
  const codeFetcher = new GitCodeFetcher(config.githubUrl);
  const scrapper = new PuppeteerPageScrapper();
  const fileScrapper = new DefaultFileSystemScrapper();
  const auditor = new PageAudit(scrapper, fileScrapper, codeFetcher, config.outputs ?? [{
    convert(result) {
      console.log(JSON.stringify(result, null, 4));
    }
  }]);
  await auditor.audit(config as AuditConfig);
  scrapper.tearDown();
  process.exit(0);
})();
