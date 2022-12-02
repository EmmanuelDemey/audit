import {AuditFunction, Metadata} from "@audit/model";
import {Page} from "puppeteer";

export const checkIfCypressAxe: AuditFunction = async (_page: Page, metadata: Metadata): Promise<boolean> => {
    const devDependencies = metadata?.packageJson?.devDependencies ?? {};

    if (!Object.keys(devDependencies)?.includes("cypress")) {
        return false;
    }
    if (!Object.keys(devDependencies)?.includes("cypress-axe")) {
        return false;
    }
    return true;
};
