#! /usr/bin/env node

import puppeteer from 'puppeteer';
import { program } from 'commander';
import { z } from 'zod';

program.name('audit').version('0.0.0');

type PageStatistics = {
  requestsNumber: number;
  pageSize: number;
  domComplexity: number;
};

const getStatistics = async (url: string): Promise<PageStatistics> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let requestsNumber = 0;
  let pageSize = 0;

  // Écouter les événements de requête pour compter le nombre total de requêtes et calculer le poids total de la page.
  page.on('request', () => {
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
    domComplexity,
    pageSize,
    requestsNumber,
  };
};

program
  .command('audit')
  .argument('<string...>', 'url to audit')
  .option('--path <char>', 'path to a folder container the project')
  .action(async (urlString) => {
    const validation = z.array(z.string().url()).safeParse(urlString);

    if (!validation.success) {
      throw new Error(`La liste doit être ue liste d'URL valides`);
    }
    try {
      for (const url of urlString) {
        const stats = await getStatistics(url);
        console.log(stats);
      }
    } catch (e) {
      console.error(`The url ${urlString} is not a valid URL`);
      process.exit(1);
    }
  });

program.parse();
