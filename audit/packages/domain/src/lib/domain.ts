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
      this.scrapper.getExternalCSS(),
      this.scrapper.getAccessibilityTree()
    ]).then(([ title, lang, scripts, links, accessibilityTree]) => {
      pageAuditResult.title = title;
      pageAuditResult.lang = lang;
      pageAuditResult.scripts = scripts;
      pageAuditResult.links = links;
      pageAuditResult.accessibilityTree = accessibilityTree
    })
    console.log(pageAuditResult)
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

  private async fetchAllLinks(links: Set<string>, acc: Set<string>): Promise<Set<string>> {
    if(!links || links.size === 0){
      return acc;
    }

    const addLink = (url): void => {
      const formattedUrl = new URL(url);
      if(!Array.from(acc).find(a => a === `${formattedUrl.origin}${formattedUrl.pathname}`)){
        foundLinks.add(`${formattedUrl.origin}${formattedUrl.pathname}`)
      }
    }
    const foundLinks: Set<string> = new Set();
    for (const link of links.values()) {
      const urls = await this.scrapper.getLinks(link);
      urls?.forEach(url => {
        if(url.endsWith('pdf')){
          return;
        }
        if(acc.size > 0 && Array.from(acc).find(a => (new URL(a).hostname) === (new URL(url).hostname))){
         addLink(url)
        }
        if(acc.size === 0 && Array.from(links).find(a => (new URL(a).hostname) === (new URL(url).hostname))){
          addLink(url)
        }
      })
    }

    const newAcc = new Set([...acc, ...foundLinks]);
    return this.fetchAllLinks(foundLinks, newAcc)
  }
  async audit(config: AuditConfig) {
    const urls = new Set(config.urls);
    const codePath = await this.codeFetcher.fetch();
    console.log(codePath)

    const results: AuditResults = {};

    const fetchedUrls = await await this.fetchAllLinks(urls, new Set());

    for(const url of fetchedUrls){
      await this.scrapper.visit(url);
      results[url] = await this.auditExternalWebPage(config);
    }
    
    this.outputs.forEach(output => output.convert(results))

    return results;
  }
}