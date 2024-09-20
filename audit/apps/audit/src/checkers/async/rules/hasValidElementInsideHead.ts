import { Checker } from '../checker';
import { Page } from 'puppeteer';

export const hasValidElementInsideHead: Checker = async (
  _url: string,
  parsers: { name: string; result: any }[],
  { page }: { page: Page }
): Promise<{ name: string; result: any; message: string } | undefined> => {
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('head > *')).filter(
      (node) =>
        !['script', 'style', 'link', 'meta', 'title'].includes(
          node.tagName.toLowerCase()
        )
    );
  });

  if (elements.length > 0) {
    return Promise.resolve({
      name: 'hasValidElementInsideHead',
      result: elements,
      message: 'You have invalid elements inside head',
    });
  }

  return Promise.resolve(undefined);
};
