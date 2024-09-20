import { Checker } from "../checker";
import { Page } from 'puppeteer';

export const hasValidDoctype: Checker = async (
    _url: string,
    parsers: { name: string; result: any }[],
    { page }: { page: Page }
  ): Promise<{ name: string; result: any; message: string } | undefined> => {
    const doctype = await page.evaluate(() => {
      const node = document.doctype;
      if (node) {
        return {
          name: node.name,
          publicId: node.publicId,
          systemId: node.systemId,
        };
      }
      return null; // Si pas de doctype
    });
  
    if (!doctype) {
      return Promise.resolve({
        name: 'hasValidDoctype',
        result: undefined,
        message: 'You do not have a doctype',
      });
    }
  
    if (
      doctype.name !== 'html' ||
      doctype.publicId !== '' ||
      doctype.systemId !== ''
    ) {
      return Promise.resolve({
        name: 'hasValidDoctype',
        result: doctype,
        message: 'You do not have a valide doctype',
      });
    }
    return Promise.resolve(undefined);
  };