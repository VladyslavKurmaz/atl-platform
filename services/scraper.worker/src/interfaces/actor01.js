'use strict';

const request = require('request');
const parseXml = require('xml2js').parseString;
const url = require('url');
const cheerio = require('cheerio');
const moment = require('moment');
const shuffle = require('fisher-yates');
const delay = require('delay');

const utils = require('./../utils');
const baseActor = require('./baseActor');

class actor01 extends baseActor {

  constructor(logger, config, db) {
    super(logger, 'Actor01', config, db);
  }

  async doRequest(url) {
    return new Promise( (resolve, reject) => {
      request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(err);
        }
      });
    });
  }

  async execute() {
    for(const kw of shuffle(keywords.slice(0,1))) {
      //
      this.logger.info(`${this.name} lookups keyword(s): ${kw}`);
      await this.doRequest(`https://jobs.dou.ua/vacancies/?category=${kw}`).
      then(async (data) => {
        // get search results
        let items = [];
        let $ = cheerio.load(data);
        $(".l-vacancy").each(function(i, e) {
          const title = $(this).find('.title > a').text();
          const href = $(this).find('.title > a').attr().href;
          const source = url.parse(href);
          source.search= '';
          items.push(url.format(source));
        });
        // scan vacancies
        for(const e of items) {
          let vacancy = null;
          await this.doRequest(e).then((data) => {
              $ = cheerio.load(data);
              const vnode = $('.b-vacancy');
              const companyUrl = $(vnode).find('.b-compinfo a').attr().href;
              const dateStr = $(vnode).find('.date').text();
              const m = moment(dateStr, 'DD MMMM YYYY', 'ru');
              vacancy = {
                url: e,
                company: {
                  id: url.parse(companyUrl).pathname.split('/')[2],
                  url: companyUrl
                },
                date: m.format('YYYY-MM-DD'),
                location: $(vnode).find('.l-vacancy .place').text().trim(),
                salary:  $(vnode).find('.l-vacancy .salary').text().trim(),
                title: $(vnode).find('.g-h2').text(),
                text:  $(vnode).find('.l-vacancy .vacancy-section').text()
              }
          }).catch( e => {
            console.log(e);
          });
          if (vacancy) {
            await this.vacancyManager.add(vacancy);
          }
          const tm = utils.getTimeout(this.config.timeouts.subLoop);
          this.logger.info(`${this.name} will sleep for ${tm} before next request`);
          await delay(tm);
        }
      }).
      catch( e => {
        console.log(e);
      });
    }
  }
}

module.exports.factory = () => (logger, config, db) => {
  const actor = new actor01(logger, config, db);
  return Object.freeze({
    getEntry: () => actor.getEntry(),
    execute: async () => await actor.execute()
  });
}

const keywords = [
  'java',
  'python',
  'golang',
  'scala',
  'erlang',
  'ruby',
  'php',
  'swift',
  'c++',
  'react',
  'react native',
  'angular',
  'nodejs',
  '.net',
  '1c',
  'android',
  'cordova',
  'analyst',
  'qa',
  'devops',
  'sre',
  'project management',
  'data science',
  'unity',
  'embedded',
  'security',
  'blockchain',
  'system administrator',
  'support',
  'hr',
  'sales',
  'dba',
  'erp',
  'crm',
  'technical writer',
  'seo'
];
/*/
request('https://jobs.dou.ua/vacancies/feeds/?category=java', (err, resp, body) => {
  if (err) {
    console.log('error:', err);
  } else {
    console.log('statusCode:', resp && resp.statusCode);
    parseXml(body, (err, res) => {
      const vacancy = res.rss.channel[0].item[2];
      const guid = url.parse(vacancy.guid[0]);
      guid.search= '';
      const desc = {
        title: vacancy.title[0],
        description: vacancy.description[0],
        source: url.format(guid),
        company: guid.pathname.split('/')[2],
        date: res.rss.channel[0].item[0].pubDate[0],
        spec: 'developer',
        base: 'C++',
        location: [],
        seniority: 'intern'
      };
      console.log(desc);
    });
  }
});
/*/
/*/
/*/

