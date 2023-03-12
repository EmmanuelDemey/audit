import { exporterLogger } from '@audit/exporter-logger';
import { mkdirSync } from 'fs';
import puppeteer, { Page } from 'puppeteer';
import { simpleGit } from 'simple-git';

const getHomePageTitle = (page: Page): Promise<string> => {
    return page.title();
};

const getLang = (page: Page): Promise<string> => {
    return page.evaluate(() => document.querySelector('html').getAttribute("lang"));
};

type RuleResult = boolean | { valid: boolean, categories: CATEGORIES[], links?: string[] }
interface PageAuditResult {
    title?: string;
    lang?: string;
    rulesResult?: {[ruleName: string]: RuleResult}
}

type AuditResults = { [url: string]: PageAuditResult};

enum CATEGORIES { ACCESSIBILITY = "ACCESSIBILITY" }

const checkTitle = async (page: Page): Promise<RuleResult> => {
    const title = await getHomePageTitle(page);
    return {
        valid: !!title,
        categories: [CATEGORIES.ACCESSIBILITY],
        links: [
            'https://www.w3.org/WAI/WCAG21/Understanding/page-titled'
        ]
    }
}

const checkHeadingWithAlertOrStatusAriaRole = async (page: Page): Promise<RuleResult> => {
    let selector = '';
    for(let i = 1; i <= 6; i++){
        selector += `h${i}[role='status'],h${i}1[role='alert']`
        if(i !== 6){
            selector += ',';
        }
    }
    const headers = await page.evaluate((selector) => Array.from(document.querySelectorAll(selector)), selector)
    return {
        valid: headers.length === 0,
        categories: [CATEGORIES.ACCESSIBILITY],
        links: [
        ]
    }
}

const rules: Array<(page: Page) => Promise<RuleResult>> = [checkTitle, checkHeadingWithAlertOrStatusAriaRole];

const auditExternalWebPage = async ({url, page}: {url: string, page: Page}): Promise<PageAuditResult> => {
    const pageAuditResult: PageAuditResult = {};
    await page.goto(url); 

    pageAuditResult.title = await getHomePageTitle(page);
    pageAuditResult.lang = await getLang(page);

    const results: {[ruleName: string]: RuleResult} = await Promise.all(rules.map(rule => rule(page))).then(results => {
        return results.reduce((acc, result, index) => {
            return {
                ...acc,
                [rules[index].name]: result

            }
        }, {})
    });

    pageAuditResult.rulesResult = results;

    return pageAuditResult;
}

(async () => {
  mkdirSync("./.tmp", { recursive: true});  
  const git = simpleGit();
  git.clone("https://github.com/EmmanuelDemey/audit", "./.tmp", { '--depth': 1})  

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const results: AuditResults = {} 

  const url = 'https://www.emmanueldemey.dev/';
  results[url] = await auditExternalWebPage({url, page});

  await browser.close();

  exporterLogger(JSON.stringify(results));
  process.exit(0);
})();
