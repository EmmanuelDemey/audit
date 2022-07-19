import {AuditFunction, Metadata} from "../types";
import {Page} from "puppeteer";

export const checkIfReadme: AuditFunction = async (_page: Page, {readme}: Metadata): Promise<boolean> => {
    return !readme;
};
