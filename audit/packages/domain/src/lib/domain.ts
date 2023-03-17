import {RuleResult, WebPageScrapper, Audit, PageAuditResult, AuditResults, CodeFetcher, Output} from "@audit/model"
import {rules} from '@audit/rules';

export class PageAudit implements Audit  {
  constructor(private readonly scrapper: WebPageScrapper, private readonly codeFetcher: CodeFetcher, private readonly outputs: Output[]) {}

  private async auditExternalWebPage() {
    const pageAuditResult: PageAuditResult = {};
    
    pageAuditResult.title = await this.scrapper.getHomePageTitle();
    pageAuditResult.lang = await this.scrapper.getLang();
    pageAuditResult.scripts = await this.scrapper.getExternalJavaScript();
    pageAuditResult.links = await this.scrapper.getExternalCSS();

    const results: { [ruleName: string]: RuleResult } = await Promise.all(
      rules.map((rule) => rule(this.scrapper))
    ).then((results) => {
      return results.reduce((acc, result, index) => {
        return {
          ...acc,
          [rules[index].name]: result,
        };
      }, {});
    });

    pageAuditResult.rulesResult = results;



    return pageAuditResult;
  }
  async audit(urls: string[]) {
    const codePath = await this.codeFetcher.fetch();
    console.log(codePath)

    const results: AuditResults = {};

    for(const url of urls){
      await this.scrapper.visit(url);
      results[url] = await this.auditExternalWebPage();
    }
    
    this.outputs.forEach(output => output.convert(results))

    return results;
  }
}