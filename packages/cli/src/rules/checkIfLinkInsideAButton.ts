import {AuditFunction} from "../types";
import {Page} from "puppeteer";

export const checkIfLinkInsideAButton: AuditFunction = async (page: Page): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("button a")?.length);
    if (size === 0) {
        return false;
    }
    return true;
};
