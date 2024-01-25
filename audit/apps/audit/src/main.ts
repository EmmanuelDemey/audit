#! /usr/bin/env node

const { program } = require('commander');
const { exists } = require('fs');

program.name('audit').version('0.0.0');

program
  .command('audit')
  .argument('<string>', 'url to audit')
  .option('--path <char>', 'path to a folder container the project')
  .action(async (urlString, options) => {
    try {
      const url = new URL(urlString);
    } catch (e) {
      console.error(`The url ${urlString} is not a valid URL`);
      process.exit(1);
    }
  });

program.parse();
