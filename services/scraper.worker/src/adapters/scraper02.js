'use strict';

const url = require('url');
const moment = require('moment');

const { baseScraper } = require('./baseScraper');

class scraper02 extends baseScraper {

  constructor(context, config) {
    super(context, config, 'Scraper02', 'https://rabota.ua');
  }

  getSearchUrl(kw) {
    return `${this.baseUrl}/zapros/` + encodeURIComponent(kw);// + '/украина';
  }

  parseSearch($) {
    const items = [];
    $(".f-vacancylist-tablewrap > tbody > tr").each(function (i, e) {
      const node = $(this).find('.fd-f-left > .fd-f1 > h3 > a');
      if (node.length) {
        const title = node.text();
        const href = node.attr().href;
        items.push(href);
      }
    });
    return items.map(e => `${this.baseUrl}${e}`);
  }

  parseVacancy($, vacancyUrl) {
    let companyUrl = null;
    let m = null;
    let location = null;
    let salary = null;
    let title = null;
    let text = null;
    //
    let node = $('.d_content');
    if (node.length) {
      companyUrl = this.baseUrl + $(node).find('a').attr().href;
      const dateStr = $(node).find('.d_des > .d-items > .d-placeholder > .d-ph-item[id=d-date] > span[class=d-ph-value]').text();
      m = moment(dateStr, 'DD.MM.YYYY', 'ru');
      location = $(node).find('.d-ph-itemAddress > .d-ph-value').text();
      salary = null;
      title = $(node).find('h1').text();;
      text = $(node).find('.d_des:has(p)').text();
  } else {
      node = $('.f-vacancy-inner-wrapper');
      if (node.length) {
        companyUrl = this.baseUrl + $(node).find('.f-vacancy-params > .f-main-params > .fd-f1 > .f-vacancy-title > a').attr().href;
        const dateStr = $(node).find('.f-vacancy-header-wrapper > .fd-f-left > .f-date-holder').text();
        m = moment(dateStr, 'DD MMM YYYY', 'ru');
        location = $(node).find('.f-vacancy-city-param').text();
        salary = null;
        title = $(node).find('.f-vacancy-header-wrapper > h1').text();
        text = $(node).find('.f-vacancy-description > div > .f-vacancy-description-inner-content').text();
      } else {
        throw new Error('Invalid page format.')
      }
    }
    return {
      companyUrl: this.context.utils.cleanupUrl(companyUrl),
      vacancy: {
        url: vacancyUrl,
        date: m.format('YYYY-MM-DD'),
        location: [location],
        salary: salary,
        title: title,
        text: text
      }
    }
  }

  parseCompany($, companyUrl) {
    let node = $('#prf-header');
    const name = $(node).find('h1[class=truncate_companyname]').text().trim();
    const masterKey = name.split('/')[0].trim().toLowerCase();
    const domain = $(node).find('#ctl00_ctl00_centerZone_cmp_site').attr().href;
    return {
      url: companyUrl,
      key: url.parse(companyUrl).pathname.split('/')[1],
      masterKey: masterKey,
      name: name,
      domain: domain
    }
  }

}

module.exports.builder = () => (context, config) => {
  return (new scraper02(context, config)).getInterface();
}


