import {AuditFunction} from "../types";
import {Page} from "puppeteer";

export const checkIfHtmlTagHasLangAttribute: AuditFunction = async (
    page: Page
): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("html[lang]")?.length);
    if (size === 1) {
        return false;
    }
    return true;
};
