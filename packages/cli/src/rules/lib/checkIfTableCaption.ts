import { AuditFunction } from '@audit/model';
import { Page } from 'puppeteer';

export const checkIfTableCaption: AuditFunction = async (
  page: Page
): Promise<boolean> => {
  const numberOfTableWithoutCaption = (await page.evaluate(() =>
    Array.from(document.querySelectorAll('table')).find(
      (table) => table.querySelectorAll('caption').length === 0
    )
  )) as HTMLTableElement;
  if (!numberOfTableWithoutCaption) {
    return false;
  }
  return true;
};
