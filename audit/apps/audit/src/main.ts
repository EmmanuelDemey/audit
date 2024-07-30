#! /usr/bin/env node

import puppeteer from 'puppeteer';
import { program } from 'commander';
import { z } from 'zod';
import { fdir } from 'fdir';
import { parse } from 'yaml';
import { readFileSync } from 'fs';

program.name('audit').version('0.0.0');

type PageStatistics = {
  requestsNumber: number;
  pageSize: number;
  domComplexity: number;
  urls: Set<string>;
};

const getStatistics = async (url: string): Promise<PageStatistics> => {
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
    domComplexity,
    pageSize,
    requestsNumber,
    urls,
  };
};

program
  .command('audit')
  .option('-u, --url <string...>', 'urls to audit')
  .option('-c, --config <char>', 'path to a config file')
  .option('--path <char>', 'path to a folder container the project')
  .action(async function () {
    let config: { urls: string } = {
      urls: this.opts().url,
    };
    if (this.opts().config) {
      config = {
        ...parse(readFileSync(this.opts().config, 'utf8')),
      };
    }

    console.log(config);
    const validation = z
      .object({
        urls: z.array(z.string().url()),
      })
      .safeParse(config);

    if (!validation.success) {
      throw new Error(`La liste doit être ue liste d'URL valides`);
    }
    const api = new fdir()
      .filter(
        (path) =>
          !path.includes('node_modules') &&
          !path.includes('.nx') &&
          !path.includes('dist')
      )
      .filter((path) => path.endsWith('package.json'))
      .withFullPaths()
      .crawl('.');

    const jsonPackages = api.sync();
    console.log(jsonPackages);

    try {
      for (const url of config.urls) {
        const stats = await getStatistics(url);
        console.log(stats);
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.parse();
