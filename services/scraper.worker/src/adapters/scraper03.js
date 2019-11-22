'use strict';

const url = require('url');
const moment = require('moment');

const { baseScraper } = require('./baseScraper');

class scraper03 extends baseScraper {

  constructor(context, config) {
    super(context, config, 'Scraper03', 'https://work.ua');
  }

  getSearchUrl(kw) {
    return `${this.baseUrl}/jobs-${kw}/`;
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
  
  parseVacancy($) {
    const node = $('.card.wordwrap');
    let companyUrl = $(node).find('p > a').attr().href;
    let companyName = $(node).find('p > a > b').text();
    const dateStr = $(node).find('.cut-bottom-print > span').text();
    let m = moment(dateStr.split(String.fromCharCode(160))[1], 'DD MMMM YYYY', 'uk_UA');
    if (!m.isValid()) {
      m = moment();
    }
    let location = $('.text-indent.add-top-sm > .glyphicon-map-marker').parent().text().split(',')[0].trim();
    let salary = $('.text-indent.text-muted.add-top-sm > b').text();
    return {
      company: {
        id: url.parse(companyUrl).pathname.split('/')[3],
        url: companyUrl,
        name: companyName
      },
      date: m.format('YYYY-MM-DD'),
      location: location,
      salary: salary,
      title: $(node).find('#h1-name').text(),
      text: $(node).find('#job-description').text().trim()
    }
  }
}

module.exports.builder = () => (context, config) => {
  return (new scraper03(context, config)).getInterface();
}


