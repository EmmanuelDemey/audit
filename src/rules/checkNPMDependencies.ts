import {AuditFunction, Metadata} from "../types";
import {Page} from "puppeteer";

const isNPMDependency = (packageJson: any, dependency: string) => {
    const dependencies = [
        ...Object.keys(packageJson?.dependencies ?? {}),
        ...Object.keys(packageJson?.devDependencies ?? {})
    ]
    return dependencies?.includes(dependency)
}

export const checkMomentDependency: AuditFunction = async (_page: Page, metadata: Metadata): Promise<boolean> => {
    return isNPMDependency(metadata.packageJson, "moment");
};

export const checkEslintDependency: AuditFunction = async (_page: Page, metadata: Metadata): Promise<boolean> => {
    return isNPMDependency(metadata.packageJson, "eslint");
};

export const checkHuskyDependency: AuditFunction = async (_page: Page, metadata: Metadata): Promise<boolean> => {
    return isNPMDependency(metadata.packageJson, "husky");
};
