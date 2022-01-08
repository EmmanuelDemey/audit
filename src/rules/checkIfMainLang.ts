import {AuditFunction, AuditResult} from "../types";
import {Page} from "puppeteer";

export const checkIfMainLang: AuditFunction = async (page: Page): Promise<AuditResult | false> => {
    const htmlNode = await page.evaluate(() => document.querySelector("html[lang]"));
    if (htmlNode) {
        return false;
    }
    return {
        name: "check-if-main-lang",
    };
};
