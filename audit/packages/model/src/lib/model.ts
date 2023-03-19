export enum CATEGORIES {
  ACCESSIBILITY = 'ACCESSIBILITY',
}

export interface WebPageScrapper {
  visit: (url: string) => void;
  getHomePageTitle: () => Promise<string>;
  getLang: () => Promise<string>;
  querySelectorAll: (selector: string) => Promise<Element[]>;
  tearDown: () => void;
  getExternalJavaScript: () => Promise<string[]>;
  getExternalCSS: () => Promise<string[]>;
}

export type RuleFactory = {
  categories: CATEGORIES[]; 
  links?: string[];
  check: (scrapper: WebPageScrapper) => Promise<boolean>
}

export type RuleResult = { valid: boolean };
export type RuleFactoryAndResult = RuleFactory & RuleResult;

export interface CodeFetcher {
  fetch: () => Promise<string>;
}

export interface Output {
  convert: (result: AuditResults) => void;
}

export interface AuditConfig {
  githubUrl: string,
  urls: string[],
  outputs: Output[],
  excludes?: CATEGORIES[]
}

export interface PageAuditResult {
  title?: string;
  lang?: string;
  scripts?: string[];
  links?: string[];
  rulesResult?: { [ruleName: string]: RuleResult };
}

export type AuditResults = { [url: string]: PageAuditResult };



export interface Audit {
  audit: (config: AuditConfig) => Promise<PageAuditResult>
}
