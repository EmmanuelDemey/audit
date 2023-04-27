class ConsoleOutput {
  convert(result) {
    console.log(JSON.stringify(result, null, 4));
  }
}

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const fse = require('fs-extra');

class AstroOutput {
  constructor(config) {
    this.distFolder = config.distFolder;
    this.launch = config.launch;

    if (existsSync(this.distFolder)) {
      fse.removeSync(this.distFolder);
    }
  }
  convert() {
    fse.copySync('./template', this.distFolder, { overwrite: true });
    if (!!this.launch) {
      execSync(`npm --prefix ${this.distFolder} run dev`, { stdio: 'inherit'});
    }
  }
}

module.exports = {
  githubUrl: 'https://github.com/EmmanuelDemey/audit',
  urls: ['https://www.emmanueldemey.dev/'],
  outputs: [
    new AstroOutput({
      distFolder: 'report_emmanueldemeydev2',
      launch: true,
    }),
  ],
  excludes: [],
};
