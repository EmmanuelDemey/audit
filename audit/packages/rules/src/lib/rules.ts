import {
  WebPageScrapper,
  CATEGORIES,
  RuleFactory,
} from '@audit/model';

const linksWithoutHref = (): RuleFactory => {
  return {
    categories: [CATEGORIES.ACCESSIBILITY],
    links: [],
    check: async (scrapper: WebPageScrapper): Promise<boolean> => {
      const elements = await scrapper.querySelectorAll('a:not([href])');
      return elements.length === 0;
    },
  };
};

const linksWithHashHref = (): RuleFactory => {
  return {
    categories: [CATEGORIES.ACCESSIBILITY],
    links: [],
    check: async (scrapper: WebPageScrapper): Promise<boolean> => {
      const elements = await scrapper.querySelectorAll("a[href='#']");
      return elements.length === 0;
    },
  };
};

const checkTitle = (): RuleFactory => {
  return {
    categories: [CATEGORIES.ACCESSIBILITY],
    links: [],
    check: async (scrapper: WebPageScrapper): Promise<boolean> => {
      const title = await scrapper.getHomePageTitle();
      return !!title;
    },
  };
};

const checkHeadingWithAlertOrStatusAriaRole = (): RuleFactory => {
  return {
    categories: [CATEGORIES.ACCESSIBILITY],
    links: [],
    check: async (scrapper: WebPageScrapper): Promise<boolean> => {
      let selector = '';
      for (let i = 1; i <= 6; i++) {
        selector += `h${i}[role='status'],h${i}1[role='alert']`;
        if (i !== 6) {
          selector += ',';
        }
      }
      const headers = await scrapper.querySelectorAll(selector);
      return headers.length === 0;
    },
  };
};

export const rules: Array<() => RuleFactory> =
  [
    checkTitle,
    checkHeadingWithAlertOrStatusAriaRole,
    linksWithoutHref,
    linksWithHashHref,
  ];
