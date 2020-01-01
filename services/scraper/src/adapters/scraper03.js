'use strict';

const url = require('url');
const moment = require('moment');

const { baseScraper } = require('./baseScraper');

class scraper03 extends baseScraper {

  constructor(context, config) {
    super(context, config, 'Scraper03', 'https://work.ua');
  }

  getSearchUrl(kw) {
    return `${this.baseUrl}/jobs-` + encodeURIComponent(kw) + `/`;
  }

  parseSearch($) {
    const items = [];
    $("#pjax-job-list > .card").each(function (i, e) {
      const node = $(this).find('h2 > a');
      if (node.length) {
        items.push(node.attr().href);
      }
    });
    return items.map(e => this.baseUrl + e);
  }
  
  parseVacancy($, vacancyUrl) {
    const node = $('.card.wordwrap');
    let companyUrl = null;
    const companyNode = $(node).find('p > a');
    if (companyNode.length) {
      companyUrl = this.baseUrl + companyNode.attr().href;
    }
    const dateStr = $(node).find('.cut-bottom-print > span').text();
    let m = moment(dateStr.split(String.fromCharCode(160))[1], 'DD MMMM YYYY', 'uk_UA');
    if (!m.isValid()) {
      m = moment();
    }
    let location = $('.text-indent.add-top-sm > .glyphicon-map-marker').parent().text().split(',')[0].trim();
    let salary = $('.text-indent.text-muted.add-top-sm > b').text();
    return {
      companyUrl: companyUrl,
      vacancy: {
        url: vacancyUrl,
        date: m.format('YYYY-MM-DD'),
        location: [location],
        salary: salary,
        title: $(node).find('#h1-name').text(),
        text: $(node).find('#job-description').text().trim()
      }
    }
  }

  parseCompany($, companyUrl) {
    let node = $('.companyJs');
    const name = $(node).find('div > div > div > div > h1').text();
    const masterKey = name.split('/')[0].trim().toLowerCase();
    const dNode = $(node).find('span.website-company.block > a');
    let domain = null;
    if (dNode.length) {
      domain = dNode.attr().href;
    }
    return {
      url: companyUrl,
      key: masterKey,
      masterKey: masterKey,
      name: name,
      domain: domain
    }
  }

/*
  let companyName = $(node).find('p > a > b').text();
  company: {
    id: url.parse(companyUrl).pathname.split('/')[3],
    url: companyUrl,
    name: companyName
  },
*/

}

module.exports.builder = () => (context, config) => {
  return (new scraper03(context, config)).getInterface();
}


