export enum CATEGORIES {
  ACCESSIBILITY = 'ACCESSIBILITY',
  QUALITY = 'QUALITY',
}

export interface WebPageScrapper {
  visit: (url: string) => void;
  getHomePageTitle: () => Promise<string>;
  getLang: () => Promise<string>;
  querySelectorAll: (selector: string) => Promise<Element[]>;
  tearDown: () => void;
  getExternalJavaScript: () => Promise<string[]>;
  getExternalCSS: () => Promise<string[]>;
  getLinks: (link: string) => Promise<string[]>;
  getAccessibilityTree: () => Promise<any>
}

export type RuleFactory = {
  categories: CATEGORIES[]; 
  links?: string[];
  check?: (scrapper: WebPageScrapper) => Promise<boolean>
  staticCheck?: (scrapper: FileSystemScrapper) => Promise<boolean>
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
  accessibilityTree?: any;
}

export type AuditResults = {
  fs?: {
    hasGithubAction?: boolean,
    hasSonarPropertiesFile?: boolean
    packageManager?: PACKAGE_MANAGER
    framework?: FRAMEWORK
  }
  webpages?: { [url: string]: PageAuditResult }
};



export interface Audit {
  audit: (config: AuditConfig) => Promise<AuditResults>
}

export type PACKAGE_MANAGER = 'npm' | 'yarn' | 'pnpm' | 'maven' | 'gradle' | undefined
export type FRAMEWORK = 'react' | 'angular' | undefined
export interface FileSystemScrapper {
  isFileExisting(path: string): Promise<boolean>;
  
  getPackageManager(root: string): Promise<PACKAGE_MANAGER>
  getFramework(root: string): Promise<FRAMEWORK>
}