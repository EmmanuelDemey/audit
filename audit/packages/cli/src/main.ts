import { exporterLogger } from '@audit/exporter-logger';
import puppeteer, { Page } from 'puppeteer';

const getHomePageTitle = (page: Page): Promise<string> => {
    return page.title();
};

const getLang = (page: Page): Promise<string> => {
    return page.evaluate(() => document.querySelector('html').getAttribute("lang"));
};

interface RuleResult { [ruleName: string]: boolean | { valid: boolean, categories: CATEGORIES[], links?: string[] }}
interface PageAuditResult {
    title?: string;
    lang?: string;
    rulesResult?: RuleResult
}

type AuditResults = { [url: string]: PageAuditResult};

enum CATEGORIES { ACCESSIBILITY = "ACCESSIBILITY" }

const checkTitle = async (page: Page): Promise<RuleResult> => {
    const title = await getHomePageTitle(page);
    return {
        'check-title': {
            valid: !!title,
            categories: [CATEGORIES.ACCESSIBILITY],
            links: [
                'https://www.w3.org/WAI/WCAG21/Understanding/page-titled'
            ]
        }
    }
}

const auditExternalWebPage = async ({url, page}: {url: string, page: Page}): Promise<PageAuditResult> => {
    const pageAuditResult: PageAuditResult = {};
    await page.goto(url); 

    pageAuditResult.title = await getHomePageTitle(page);
    pageAuditResult.lang = await getLang(page);
    pageAuditResult.rulesResult = {
        ...(await checkTitle(page))
    }

    return pageAuditResult;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const results: AuditResults = {} 

  const url = 'https://www.emmanueldemey.dev/';
  results[url] = await auditExternalWebPage({url, page});

  await browser.close();

  exporterLogger(JSON.stringify(results));
  process.exit(0);
})();
