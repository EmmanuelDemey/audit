import {AuditFunction, AuditResult} from "@audit/model";
import {Page} from "puppeteer";

export type CheckIfLandmarksAuditResult = AuditResult & {
    payload: {
        hasHeaderLandmark: boolean,
        hasNavLandmark: boolean,
        hasMainLandmark: boolean,
        hasFooterLandmark: boolean
    }
}
export const checkIfLandmarks: AuditFunction = async (page: Page): Promise<CheckIfLandmarksAuditResult | false> => {
    const hasHeaderLandmark = await page.evaluate(() => Array.from(document.querySelectorAll("header")).length > 0) as boolean;
    const hasNavLandmark = await page.evaluate(() => Array.from(document.querySelectorAll("nav")).length > 0) as boolean;
    const hasMainLandmark = await page.evaluate(() => Array.from(document.querySelectorAll("main")).length > 0) as boolean;
    const hasFooterLandmark = await page.evaluate(() => Array.from(document.querySelectorAll("footer")).length > 0) as boolean;

    if (hasHeaderLandmark && hasNavLandmark && hasMainLandmark && hasFooterLandmark) {
        return false;
    }

    const payload = {
        hasHeaderLandmark,
        hasNavLandmark,
        hasMainLandmark,
        hasFooterLandmark
    }
    return {
        name: "check-if-landmarks",
        payload
    };
};
