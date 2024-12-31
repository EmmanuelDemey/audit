import { listen } from 'listhen';
import yoctoSpinner from 'yocto-spinner';
import logger from '../logger';
import { HttpChecker } from '../checkers/async/http-system-checker';
import { FileSystemChecker } from '../checkers/sync/file-system-checker';
import { FileSystemParser } from '../parsers/file-system-parser';

type AuditResult = {
  parsers?: Array<{ name: string; result: any }>;
  syncChecks?: Array<{ name: string; result: any }>;
  asyncChecks?: Record<string, Array<{ name: string; result: any }>>;
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      let config;
      try {
        config = JSON.parse(body);
      } catch {
        config = {};
      }
      const spinner = yoctoSpinner({ text: 'Please wait...' }).start();

      const audit: AuditResult = {};

      const fileSystemParser = new FileSystemParser();
      audit.parsers = fileSystemParser.parse('.');
      if (!config['only-parser']) {
        const fileSystemChecker = new FileSystemChecker(audit.parsers);
        audit.syncChecks = fileSystemChecker.check();

        if (config.urls) {
          const httpChecker = new HttpChecker(audit.parsers);

          try {
            audit.asyncChecks = {};
            for (const url of config.urls) {
              logger.info(`Starting auditing with async checks: ${url}`);
              audit.asyncChecks[url] = await httpChecker.check(url);
            }
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        }
      }
      spinner.success('Success!');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(audit));
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Utilisez une requête POST pour envoyer des données');
  }
};

export const startServer = async () => {
  await listen(handler);
};
