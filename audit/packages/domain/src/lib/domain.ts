import {RuleResult, WebPageScrapper, Audit, PageAuditResult, AuditResults, CodeFetcher, Output, RuleFactoryAndResult, AuditConfig} from "@audit/model"
import {rules} from '@audit/rules';

export class PageAudit implements Audit  {
  constructor(private readonly scrapper: WebPageScrapper, private readonly codeFetcher: CodeFetcher, private readonly outputs: Output[]) {}

  private async auditExternalWebPage(config: AuditConfig) {
    const pageAuditResult: PageAuditResult = {};
    
    pageAuditResult.title = await this.scrapper.getHomePageTitle();
    pageAuditResult.lang = await this.scrapper.getLang();
    pageAuditResult.scripts = await this.scrapper.getExternalJavaScript();
    pageAuditResult.links = await this.scrapper.getExternalCSS();

    Promise.all([
      this.scrapper.getHomePageTitle(),
      this.scrapper.getLang(),
      this.scrapper.getExternalJavaScript(),
      this.scrapper.getExternalCSS()
    ]).then(([ title, lang, scripts, links]) => {
      pageAuditResult.title = title;
      pageAuditResult.lang = lang;
      pageAuditResult.scripts = scripts;
      pageAuditResult.links = links;
    })

    const results: { [ruleName: string]: RuleResult } = await Promise.all(
      rules
      .map(rule => rule())
      .filter(rule => {
        return rule.categories.filter(category => config.excludes.indexOf(category) < 0 ).length > 0
      })
      .map(factory => {
        return factory.check(this.scrapper).then(result => ({ ...factory, valid: result }))
      })
    ).then((results: RuleFactoryAndResult[]) => {
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
  async audit(config: AuditConfig) {
    const urls = config.urls;
    const codePath = await this.codeFetcher.fetch();
    console.log(codePath)

    const results: AuditResults = {};

    for(const url of urls){
      await this.scrapper.visit(url);
      results[url] = await this.auditExternalWebPage(config);
    }
    
    this.outputs.forEach(output => output.convert(results))

    return results;
  }
}