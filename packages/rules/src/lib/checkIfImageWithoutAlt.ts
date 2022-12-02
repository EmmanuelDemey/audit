import {AuditFunction} from "@audit/model";
import {Page} from "puppeteer";

export const checkIfImageWithoutAlt: AuditFunction = async (page: Page): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("img:not([alt])")?.length);
    if (size === 0) {
        return false;
    }
    return true;
};
