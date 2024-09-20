import puppeteer, { Page } from 'puppeteer';
import { Checker } from './checker';
import { hasValidDoctype } from './rules/hasValidDoctype';
import { hasValidElementInsideHead } from './rules/hasValidElementInsideHead';
import { hasBasicLayoutElement } from './rules/hasBasicLayoutElement';

const hasTitle: Checker = async (
  _url: string,
  parsers: { name: string; result: any }[],
  { page }: { page: Page }
): Promise<{ name: string; result: any; message: string } | undefined> => {
  const title = await page.$eval('title', (elt) => elt.innerHTML);

  if (!title) {
    return Promise.resolve({
      name: 'hasTitle',
      result: undefined,
      message: 'You must have one title',
    });
  }
  return Promise.resolve(undefined);
};

const hasAtLeastOneAnalyticsTools: Checker = (
  _url,
  parsers,
  { urls }
): Promise<{ name: string; result: any; message: string } | undefined> => {
  const analytics = Array.from(urls).filter((request) =>
    ['matomo.js', 'metricalp'].find((a) => request.includes(a))
  );

  if (analytics.length > 1) {
    return Promise.resolve({
      name: 'hasAtLeastOneAnalyticsTools',
      result: analytics,
      message: 'You have multiple analytics tools',
    });
  }

  return Promise.resolve(undefined);
};

const getStatistics = async (
  url: string,
  parsers: { name: string; result: any }[]
): Promise<{ name: string; result: any }> => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  let requestsNumber = 0;
  let pageSize = 0;

  const urls = new Set<string>();

  // Écouter les événements de requête pour compter le nombre total de requêtes et calculer le poids total de la page.
  page.on('request', (request) => {
    urls.add(request.url());
    requestsNumber++;
  });

  page.on('response', async (response) => {
    const responseHeaders = response.headers();
    const responseSize = parseInt(responseHeaders['content-length'], 10);
    if (!isNaN(responseSize)) {
      pageSize += responseSize;
    }
  });

  await page.goto(url, { waitUntil: 'networkidle0' });

  // Calculer le nombre d'éléments HTML sur la page.
  const domComplexity: number = await page.evaluate(
    () => document.querySelectorAll('*').length
  );

  await browser.close();
  return {
    name: 'statistics',
    result: {
      domComplexity,
      pageSize,
      requestsNumber,
      urls,
      page,
    },
  };
};

const getImageWithoutAlts = async (url: string, _parsers: any) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const imagesWithoutAlts = await page.evaluate(() =>
    document.querySelectorAll('img:not([alt])')
  );
  console.log(imagesWithoutAlts);

  if (imagesWithoutAlts.length > 0) {
    return { name: 'imageWithoutAlts', result: imagesWithoutAlts.item };
  }
};
export class HttpChecker {
  #checkers: Checker[] = [
    getImageWithoutAlts,
    hasAtLeastOneAnalyticsTools,
    hasTitle,
    hasValidDoctype,
    hasValidElementInsideHead,
    hasBasicLayoutElement,
  ];
  constructor(private parsers: { name: string; result: any }[]) {}
  async check(url: string) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const statistics = await getStatistics(url, this.parsers);

    const responses = await Promise.all(
      this.#checkers.map((checker) => {
        return checker(url, this.parsers, {
          urls: statistics.result.urls,
          page,
        });
      })
    ).then((result) => result.filter((r) => !!r));

    return [statistics, ...responses];
  }
}
