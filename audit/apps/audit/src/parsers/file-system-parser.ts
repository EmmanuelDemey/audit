import { fdir } from 'fdir';

export type Parser = (responseootPath) => { name: string; result: any };

const nodePackageManager = {
  'package-lock.json': 'npm',
  'yarn.lock': 'yarn',
};

const isTypescriptProject: Parser = (rootPath) => {
  const files = new fdir()
    .filter(
      (path) =>
        !path.includes('node_modules') &&
        !path.includes('.nx') &&
        !path.includes('tmp') &&
        !path.includes('dist')
    )
    .filter((path) => path.endsWith('tsconfig.json'))
    .withFullPaths()
    .crawl(rootPath)
    .sync();

  return { name: 'typescript', result: files.length > 0 };
};

const getPackageManagerConfigurationFilePath: Parser = (rootPath) => {
  const files = new fdir()
    .filter(
      (path) =>
        !path.includes('node_modules') &&
        !path.includes('.nx') &&
        !path.includes('tmp') &&
        !path.includes('dist')
    )
    .filter((path) => path.endsWith('package.json'))
    .withFullPaths()
    .crawl(rootPath)
    .sync();

  return { name: 'packageManagerConfigurationFilePath', result: files };
};

const getPackageManager: Parser = (rootPath) => {
  const pckManagers = new fdir()
    .filter(
      (path) =>
        !path.includes('node_modules') &&
        !path.includes('.nx') &&
        !path.includes('tmp') &&
        !path.includes('dist')
    )
    .filter(
      (path) =>
        !!Object.keys(nodePackageManager).find((lock) => {
          return path.endsWith(lock);
        })
    )
    .withFullPaths()
    .crawl(rootPath)
    .sync()
    .map((path) => {
      return Object.entries(nodePackageManager).find(
        ([file]: [string, string]) => {
          return path.endsWith(file);
        }
      )[1];
    })
    .filter((packageManager) => !!packageManager);

  return { name: 'packageManager', result: pckManagers };
};

export class FileSystemParser {
  #parsers = [
    getPackageManagerConfigurationFilePath,
    getPackageManager,
    isTypescriptProject,
  ];
  #crawler: any;

  parse(rootPath: string) {
    return this.#parsers.map((parser) => parser(rootPath));
  }
}
