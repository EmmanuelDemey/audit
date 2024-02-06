#! /usr/bin/env node

const puppeteer = require('puppeteer');

const { program } = require('commander');
const { exists } = require('fs');

program.name('audit').version('0.0.0');

type PageStatistics = {
  requestsNumber: number;
  pageSize: number;
  domComplexity: number;
};

const getStatistics = async (url: string): Promise<PageStatistics> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let requestsNumber: number = 0;
  let pageSize: number = 0;

  // Écouter les événements de requête pour compter le nombre total de requêtes et calculer le poids total de la page.
  page.on('request', (request) => {
    requestsNumber++;
  });

  page.on('response', async (response) => {
    const responseHeaders = response.headers();
    let responseSize: number = parseInt(responseHeaders['content-length'], 10);
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
    domComplexity,
    pageSize,
    requestsNumber,
  };
};

program
  .command('audit')
  .argument('<string...>', 'url to audit')
  .option('--path <char>', 'path to a folder container the project')
  .action(async (urlString, options) => {
    try {
      //const url = new URL(urlString);
      for (let url of urlString) {
        const stats = await getStatistics(url);
        console.log(stats);
      }
    } catch (e) {
      console.error(`The url ${urlString} is not a valid URL`);
      process.exit(1);
    }
  });

program.parse();
