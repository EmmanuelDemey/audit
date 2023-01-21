import { AuditFunction, AuditResult, Metadata } from '@audit/model';
import { Page } from 'puppeteer';

const hasNPMDependency = (packageJson: any, dependency: string) => {
  const dependencies = [
    ...Object.keys(packageJson?.dependencies ?? {}),
    ...Object.keys(packageJson?.devDependencies ?? {}),
  ];
  return dependencies?.includes(dependency);
};

export const checkMomentDependency: AuditFunction = async (
  _page: Page,
  metadata: Metadata
): Promise<boolean | AuditResult> => {
  if (hasNPMDependency(metadata.packageJson, 'moment')) {
    return {
      message:
        'Vous devriez utilisr un concurrent de moment (date-fns ou day.js) qui sont plus légers',
    };
  }
  return false;
};

export const checkForIsArray: AuditFunction = async (
  _page: Page,
  metadata: Metadata
): Promise<boolean | AuditResult> => {
  if (hasNPMDependency(metadata.packageJson, 'isarray')) {
    return {
      message:
        'Cette librairie est surement inutile. Vous devriez utiliser la méthode native Array.isArray',
    };
  }
  return false;
};

export const checkEslintDependency: AuditFunction = async (
  _page: Page,
  metadata: Metadata
): Promise<boolean | AuditResult> => {
  if (hasNPMDependency(metadata.packageJson, 'eslint')) {
    return true;
  }
  return false;
};

export const checkHuskyDependency: AuditFunction = async (
  _page: Page,
  metadata: Metadata
): Promise<boolean | AuditResult> => {
  if (hasNPMDependency(metadata.packageJson, 'husky')) {
    return true;
  }
  return false;
};

export const npmRules = [
  checkMomentDependency,
  checkForIsArray,
  checkEslintDependency,
  checkHuskyDependency,
];
