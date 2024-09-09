import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { string } from 'zod';

type Checker = (
  parsers: { name: string; result: any }[]
) => { name: string; result: any } | undefined;

const checkIfDevOrProdDependenciesPresent = (
  path: string[],
  dependencyName: string,
  devDependencies = false
) => {
  const result = {};
  path.map((path) => {
    const r = JSON.parse(readFileSync(path).toString());
    if (
      Object.keys(
        r[devDependencies ? 'devDependencies' : 'dependencies']
      ).includes(dependencyName)
    )
      result[path] = {
        [dependencyName]:
          r[devDependencies ? 'devDependencies' : 'dependencies'][
            dependencyName
          ],
      };
  });
  return result;
};

const checkIfDevDepenciesPresent = (path: string[], dependencyName: string) => {
  return checkIfDevOrProdDependenciesPresent(path, dependencyName, true);
};

const checkIfDependenciesPresent = (path: string[], dependencyName: string) => {
  return checkIfDevOrProdDependenciesPresent(path, dependencyName);
};

const generateDependenciesRule = (
  packageName: string,
  devDependencies = false
): Checker => {
  return (parsers: { name: string; result: any }[]) => {
    const packageManagerConfigurationFilePath = parsers.find(
      (parser) => parser.name === 'packageManagerConfigurationFilePath'
    );
    if (!packageManagerConfigurationFilePath) {
      return;
    }

    const result = checkIfDevOrProdDependenciesPresent(
      packageManagerConfigurationFilePath.result,
      packageName,
      devDependencies
    );

    if (Object.keys(result).length === 0) {
      return;
    }

    return { name: `has_${packageName}_dependency`, result };
  };
};

const dependenciesCheck = [
  generateDependenciesRule('moment'),
  generateDependenciesRule('underscore'),
  generateDependenciesRule('underscore'),
  generateDependenciesRule('karma'),
];

const npmAudit = (parsers: { name: string; result: any }[]) => {
  const packageManager = parsers.find(
    (parser) => parser.name === 'packageManager'
  );
  if (!packageManager) {
    return;
  }

  if (
    packageManager.result.includes('npm') ||
    packageManager.result.includes('yarn')
  ) {
    try {
      execSync(`npm --prefix . outdated --json`);
    } catch (e) {
      return { name: 'npm_outdated', result: JSON.parse(e.stdout.toString()) };
    }
  }
  return;
};

export class FileSystemChecker {
  #checkers: Checker[] = [npmAudit, ...dependenciesCheck];
  constructor(private parsers: { name: string; result: any }[]) {}
  check() {
    return this.#checkers
      .map((checker) => checker(this.parsers))
      .filter((result) => !!result);
  }
}
