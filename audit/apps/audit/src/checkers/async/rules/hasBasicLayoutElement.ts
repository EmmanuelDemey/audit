import { Checker } from '../checker';
import { Page } from 'puppeteer';

export const hasBasicLayoutElement: Checker = async (
  _url: string,
  parsers: { name: string; result: any }[],
  { page }: { page: Page }
): Promise<{ name: string; result: any; message: string } | undefined> => {
  const header = await page.evaluate(() => {
    return document.querySelector('header');
  });

  if (header === null) {
    return Promise.resolve({
      name: 'hasBasicLayoutElement',
      result: undefined,
      message: 'Its looks like yo do not have any header',
    });
  }

  const body = await page.evaluate(() => {
    return document.querySelector('body');
  });

  if (body === null) {
    return Promise.resolve({
      name: 'hasBasicLayoutElement',
      result: undefined,
      message: 'Its looks like yo do not have any body',
    });
  }

  const footer = await page.evaluate(() => {
    return document.querySelector('header');
  });

  if (footer === null) {
    return Promise.resolve({
      name: 'hasBasicLayoutElement',
      result: undefined,
      message: 'Its looks like yo do not have any footer',
    });
  }

  return Promise.resolve(undefined);
};
