import {AuditFunction} from "@audit/model";
import {Page} from "puppeteer";

export const checkIfButtonWithoutType: AuditFunction = async (page: Page): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("button:not(type)")?.length);
    if (size === 0) {
        return false;
    }
    return true
};
