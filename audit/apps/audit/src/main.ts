#! /usr/bin/env node

import { program } from 'commander';
import { z } from 'zod';
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { FileSystemParser } from './parsers/file-system-parser';
import { FileSystemChecker } from './checkers/sync/file-system-checker';
import { HttpChecker } from './checkers/async/http-system-checker';

program.name('audit').version('0.0.0');

type AuditResult = {
  parsers?: Array<{ name: string; result: any }>;
  syncChecks?: Array<{ name: string; result: any }>;
  asyncChecks?: Record<string, Array<{ name: string; result: any }>>;
};

program
  .command('audit')
  .option('-c, --config <char>', 'path to a config file')
  .action(async function () {
    let config: { urls: string } = {
      urls: this.opts().url,
    };
    console.log(this.opts());
    if (this.opts().config) {
      console.log('YO', this.opts().config);
      config = {
        ...parse(readFileSync(this.opts().config, 'utf8')),
      };
    }

    /*const validation = z
      .object({
        urls: z.array(z.string().url()),
      })
      .safeParse(config);

    if (!validation.success) {
      throw new Error(`La liste doit être ue liste d'URL valides`);
    }*/

    const audit: AuditResult = {};

    const fileSystemParser = new FileSystemParser();
    audit.parsers = fileSystemParser.parse('.');

    const fileSystemChecker = new FileSystemChecker(audit.parsers);
    audit.syncChecks = fileSystemChecker.check();

    if (config.urls) {
      const httpChecker = new HttpChecker(audit.parsers);

      try {
        audit.asyncChecks = {};
        for (const url of config.urls) {
          audit.asyncChecks[url] = await httpChecker.check(url);
        }
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }

    console.log(JSON.stringify(audit));
  });


program.parse();
