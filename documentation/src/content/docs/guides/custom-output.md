---
title: Custom Output
---

In the `audit.config.js` configuration file, you are able to define multiple custom outputs, in order to generate the report you want. 

```javascript
module.exports = {
  outputs: [ ... ],
};

```

Each custom outputs needs to be an object with a convert function. 

```javascript
class ConsoleOutput {
  convert(result) {
    console.log(JSON.stringify(result, null, 4));
  }
}
module.exports = {
  outputs: [ new ConsoleOutput() ],
};
```

Here is an example when we generate an Astro static website. 

```javascript
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
    new AstroOutput({
      distFolder: 'report_emmanueldemeydev2',
      launch: true,
    }),
  ],
  excludes: [],
};

```