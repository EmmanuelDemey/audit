class ConsoleOutput {
  convert(result) {
    console.log(JSON.stringify(result, null, 4));
  }
}

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { join } = require("path");
const fse = require('fs-extra');

class AstroOutput {
  TRAINING_PLATFORM_HIDDEN_FOLDER = join(__dirname, ".audit");

  constructor(config) {
    this.distFolder = config.distFolder;
    this.launch = config.launch;

    if (existsSync(this.distFolder)) {
      fse.removeSync(this.distFolder);
    }
  }

  downloadAstroTemplate() {
    if (!existsSync(this.TRAINING_PLATFORM_HIDDEN_FOLDER)) {
      execSync(`npm create astro@latest -- ${this.TRAINING_PLATFORM_HIDDEN_FOLDER} --install --template starlight --no-git --typescript strict`, {
        stdio: "inherit",
      });
    }
  };

  convert() {
    this.downloadAstroTemplate();
    fse.copySync(this.TRAINING_PLATFORM_HIDDEN_FOLDER, this.distFolder);
  }
}

module.exports = {
  githubUrl: 'https://github.com/EmmanuelDemey/audit',
  urls: ['https://www.emmanueldemey.dev/'],
  outputs: [
    /*new AstroOutput({
      distFolder: 'report_emmanueldemeydev2',
      launch: true,
    }),*/
    new ConsoleOutput()
  ],
  excludes: [],
};
