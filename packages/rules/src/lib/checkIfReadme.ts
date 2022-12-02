import {AuditFunction, Metadata} from "@audit/model";
import {Page} from "puppeteer";

export const checkIfReadme: AuditFunction = async (_page: Page, {readme}: Metadata): Promise<boolean> => {
    return !readme;
};
