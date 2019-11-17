'use strict';

const parseXml = require('xml2js').parseString;
const moment = require('moment');
const shuffle = require('fisher-yates');
const delay = require('delay');

const utils = require('../utils');
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
        const title = node.text();
        const href = node.attr().href;
        items.push(href);
      }
    });
    return items.map(e => this.baseUrl + e);
  }
  
  parseVacancy($) {
    const node = $('.card');
    //const companyUrl = $(vnode).find('.b-compinfo > a').attr().href;
    const dateStr = $(node).find('.cut-bottom-print > span').text();
    const arr = dateStr.split(String.fromCharCode(160));
    const m = moment(arr[1], 'DD MMMM YYYY', 'uk_UA');
    return {/*
      company: {
        id: url.parse(companyUrl).pathname.split('/')[2],
        url: companyUrl,
        name: $(vnode).find('.b-compinfo > .info > .l-n > a').first().text()
      },*/
      date: m.format('YYYY-MM-DD'),
      //location: $(vnode).find('.l-vacancy .place').text().trim(),
      //salary: $(vnode).find('.l-vacancy .salary').text().trim(),*/
      title: $(node).find('h1').text(),
      text: $(node).find('#job-description').text()
    }
  }
}

module.exports.builder = () => (context, config) => {
  return (new scraper03(context, config)).getInterface();
}


