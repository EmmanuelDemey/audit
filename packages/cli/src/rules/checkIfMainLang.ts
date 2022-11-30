import {AuditFunction} from "../types";
import {Page} from "puppeteer";

export const checkIfMainLang: AuditFunction = async (page: Page): Promise<boolean> => {
    const htmlNode = await page.evaluate(() => document.querySelector("html[lang]"));
    if (htmlNode) {
        return false;
    }
    return true;
};
