import { exporterLogger } from '@audit/exporter-logger';
import puppeteer, { Page } from 'puppeteer';

const getHomePageTitle = (page: Page): Promise<string> => {
    return page.title();
};

const getLang = (page: Page): Promise<string> => {
    return page.evaluate(() => document.querySelector('html').getAttribute("lang"));
};

interface PageAuditResult {
    title?: string;
    lang?: string;
}

type AuditResults = { [url: string]: PageAuditResult};

const auditExternalWebPage = async (url: string, page: Page): Promise<PageAuditResult> => {
    const pageAuditResult: PageAuditResult = {};
    await page.goto('https://www.emmanueldemey.dev/'); 
    pageAuditResult.title = await getHomePageTitle(page);
    pageAuditResult.lang = await getLang(page);
    return pageAuditResult;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const results: AuditResults = {} 
  
  const url = 'https://www.emmanueldemey.dev/';
  results[url] = await auditExternalWebPage(url, page);

  await browser.close();

  exporterLogger(JSON.stringify(results));
  process.exit(0);
})();
