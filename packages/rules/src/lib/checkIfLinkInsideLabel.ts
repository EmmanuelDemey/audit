import {AuditFunction} from "@audit/model";
import {Page} from "puppeteer";

export const checkIfLinkInsideLabel: AuditFunction = async (page: Page): Promise<boolean> => {
    const size = await page.evaluate(() => document.querySelectorAll("label a")?.length);
    if (size === 0) {
        return false;
    }
    return true;
};
