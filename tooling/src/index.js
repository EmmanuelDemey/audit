const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const request = require("request");
const util = require("util");
const fs = require("fs");
const { argv } = require("yargs");

const options = {
  logLevel: "info",
  disableDeviceEmulation: true,
  chromeFlags: ["--disable-mobile-emulation"],
};

async function lighthouseFromPuppeteer(url, options, config = null) {
  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;

  const resp = await util.promisify(request)(
    `http://localhost:${options.port}/json/version`
  );
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });

  const { lhr } = await lighthouse(url, options, config);
  await browser.disconnect();
  await chrome.kill();
  return Object.entries(lhr.categories).reduce(
    (acc, [_, result]) => ({ ...acc, [result.title]: result.score }),
    {}
  );
}

async function generateAudit({ application, url }) {
  const result = await lighthouseFromPuppeteer(url, options);
  const content = `
# Audit

Ce rapport fait suite à l'audit réalisé pour l'application ${application}

Auditeurs : 
* Emmanuel DEMEY: demey.emmanuel@gmail.com

## Audit automatique

Avant de faire un audit manuel, nous allons tout d'abord réaliser des audits automatiques afin de détecter 
des premiers points d'améliorations. 

### Lighthouse

    ${Object.entries(result)
      .map(([key, note]) => {
        return `* ${key}: ${note}`;
      })
      .join("\n")}
  `;
  return content;
}

(async function () {
  const content = await generateAudit(argv);
  console.log(content);
  fs.writeFile("./result.md", content, () => {
    console.log("file generated");
  });
})();
