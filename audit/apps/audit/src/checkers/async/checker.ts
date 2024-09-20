import { Page } from 'puppeteer';
import { Result } from '../result';

export type Checker = (
  url: string,
  parsers: { name: string; result: any }[],
  { urls, page }?: { urls: Set<string>; page: Page }
) => Promise<Result | undefined>;
