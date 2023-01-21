import { AuditFunction, AuditResult, Metadata } from '@audit/model';
import { Page } from 'puppeteer';

export const checkIfNoDuplicatePageTitle: AuditFunction = async (
  page: Page,
  { urls }: Metadata
): Promise<boolean | AuditResult> => {
  if (!urls) {
    return false;
  }

  const titles = [];
  for (const url of urls) {
    await page.goto(url);
    const title = await page.evaluate(
      () => document.querySelector('title')?.innerHTML
    );
    titles.push(title);
  }

  const titlesMap = titles.reduce(
    (acc: { [key: string]: number }, title = '') => {
      return {
        ...acc,
        [title]: (acc[title] ?? 0) + 1,
      };
    },
    {}
  );

  const hasDuplicated = Object.values(titlesMap).find(
    (titleCount) => titleCount > 1
  );
  if (!hasDuplicated) {
    return false;
  }

  return {
    payload: titlesMap,
  };
};
