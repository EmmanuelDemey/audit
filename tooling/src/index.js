const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const request = require("request");
const util = require("util");

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

(async function () {
  const result = await lighthouseFromPuppeteer("https://pptr.dev", options);
  console.log(`
# Audit

## Lighthouse

    ${Object.entries(result)
      .map(([key, note]) => {
        return `* ${key}: ${note}`;
      })
      .join("\n")}
  `);
})();
