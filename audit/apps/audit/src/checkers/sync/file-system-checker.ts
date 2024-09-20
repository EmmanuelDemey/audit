import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { Result } from '../result';

type Checker = (parsers: { name: string; result: any }[]) => Result | undefined;

const checkIfDevOrProdDependenciesPresent = (
  path: string[],
  dependencyName: string,
  devDependencies = false
) => {
  const result = {};
  path.forEach((path) => {
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

const generateDependenciesRule = (
  packageName: string,
  devDependencies = false,
  replacement?: string
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

    if (replacement) {
      return {
        name: `has_${packageName}_dependency`,
        result,
        message: `You should use ${replacement} instead of ${packageName}`,
      };
    }
    return { name: `has_${packageName}_dependency`, result };
  };
};

const dependenciesCheck = [
  generateDependenciesRule('moment'),
  generateDependenciesRule('underscore'),
  generateDependenciesRule('underscore'),
  generateDependenciesRule('karma', true),
  generateDependenciesRule('react-scripts', true, 'vite'),
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
