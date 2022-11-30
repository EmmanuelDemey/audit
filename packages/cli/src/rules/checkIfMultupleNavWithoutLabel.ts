import {AuditFunction} from "../types";
import {Page} from "puppeteer";

export const checkIfMultipleNavWithoutLabel: AuditFunction = async (page: Page): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("nav:not([aria-label]), nav:not([aria-labelledby])")?.length);
    if (size <= 1) {
        return false;
    }
    return true;
};
