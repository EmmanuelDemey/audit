import { execSync } from 'node:child_process';

type Checker = (
  parsers: { name: string; result: any }[]
) => { name: string; result: any } | undefined;

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
  #checkers: Checker[] = [npmAudit];
  constructor(private parsers: { name: string; result: any }[]) {}
  check() {
    return this.#checkers
      .map((checker) => checker(this.parsers))
      .filter((result) => !!result);
  }
}
