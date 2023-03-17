import {WebPageScrapper, RuleResult, CATEGORIES} from "@audit/model";

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

export const rules: Array<(scrapper: WebPageScrapper) => Promise<RuleResult>> = [
  checkTitle,
  checkHeadingWithAlertOrStatusAriaRole,
];