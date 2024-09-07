import puppeteer from 'puppeteer';

type Checker = (
  url: string,
  parsers: { name: string; result: any }[]
) => Promise<{ name: string; result: any } | undefined>;

const getStatistics = async (
  url: string,
  parsers: { name: string; result: any }[]
): Promise<{ name: string; result: any }> => {
  const browser = await puppeteer.launch();
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
    },
  };
};

const getImageWithoutAlts = async (url: string, _parsers: any) => {
  const browser = await puppeteer.launch();
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
  #checkers: Checker[] = [getStatistics, getImageWithoutAlts];
  constructor(private parsers: { name: string; result: any }[]) {}
  check(url: string) {
    return Promise.all(
      this.#checkers.map((checker) => checker(url, this.parsers))
    ).then((result) => result.filter((r) => !!r));
  }
}
