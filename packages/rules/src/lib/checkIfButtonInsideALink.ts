import {AuditFunction} from "@audit/model";
import {Page} from "puppeteer";

export const checkIfButtonInsideALink: AuditFunction = async (page: Page): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("a button")?.length);
    if (size === 0) {
        return false;
    }
    return true
};
