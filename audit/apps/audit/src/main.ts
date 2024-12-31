#! /usr/bin/env node

import { program } from 'commander';
import { readFileSync } from 'fs';
import { parse } from 'yaml';

import { request } from 'undici';
import { startServer } from './utils/server';
import { isOptionsValid } from './utils/validateOptions';

program.name('audit').version('0.0.0');

program.command('serve').action(async function () {
  await startServer();
});

program
  .command('audit')
  .argument('<string>', 'path to a config file')
  .action(async function (configPath: string) {
    const config = {
      ...parse(readFileSync(configPath, 'utf8')),
    };

    if (!isOptionsValid(config)) {
      throw new Error(`La liste doit être ue liste d'URL valides`);
    }

    await startServer();

    const { body } = await request('http://localhost:3000/', {
      method: 'POST',
      body: Buffer.from(JSON.stringify(config)),
    });

    let audit;
    for await (const data of body) {
      audit += data.toString();
    }

    console.log(JSON.stringify(audit));
  });

program.parse();
