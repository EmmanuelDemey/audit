const { program } = require('commander');

program.name('audit').version('0.0.0');

program
  .command('audit')
  .argument('<string>', 'url to audit')
  .option('--path <char>', 'path to a folder container the project')
  .action((url, options) => {
    console.log(options, url);
  });

program.parse();
