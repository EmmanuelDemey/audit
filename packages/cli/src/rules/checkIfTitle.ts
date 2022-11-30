import {AuditFunction} from "../types";
import {Page} from "puppeteer";

export const checkIfTitle: AuditFunction = async (page: Page): Promise<boolean> => {
    const htmlNode = await page.evaluate(() => document.querySelector("title")) as HTMLTitleElement;
    if (htmlNode) {
        if(htmlNode.text === ''){
            return true
        }
        return false;
    }
    return true;
};
