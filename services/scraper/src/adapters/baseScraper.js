'use strict';

const request = require('request');
const shuffle = require('fisher-yates');
const delay = require('delay');
const cheerio = require('cheerio');

const baseItem = require('../baseItem');
const utils = require('../utils');

class baseScraper extends baseItem {
  constructor(context, config, name, baseUrl) {
    super(context);
    this.config = config;
    this.name = name;
    this.baseUrl = baseUrl;
    this.vacancyManager = this.context.rules.createVacancyManager(this.context.clone('logger', 'utils', 'db', 'entities'));
  }

  getEntry() {
    return {
      timeout: this.config.timeouts.mainLoop,
      execute: async () => await this.execute()
    };
  }

  async doRequest(url) {
    const req = request.defaults({
      headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36'}
    });
    return new Promise( (resolve, reject) => {
      req(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(err);
        }
      });
    });
  }

  async execute() {
    let i = 0;
    const kws = shuffle(keywords/*.slice(0, 1)*/);
    const kwsCount = kws.length;
    for (const kw of kws) {
      i++;
      await this.doRequest(this.getSearchUrl(kw)).
        then(async (data) => {
          // get search results
          let $ = cheerio.load(data);
          let items = this.parseSearch($);
          // scan vacancies
          let j = 0;
          const count = items.length;
          for (const e of items) {
            const tm = utils.getTimeout(this.config.timeouts.subLoop);
            this.context.logger.info(`${this.name} will sleep for ${tm} before next request`);
            await delay(tm);
            //
            j++;
            this.context.logger.info(`${this.name} [${kw} ${i}/${kwsCount}] [${j}/${count}, ${e}`);
            let vacancy = null;
            let companyUrl = null;
            let company = null;
            await this.doRequest(e).then((data) => {
              $ = cheerio.load(data);
              ({ companyUrl, vacancy } = this.parseVacancy($, e));
            }).catch(e => {
              this.context.logger.error(this.name, e);
            });
            if (companyUrl) {
              // parse company
              await this.doRequest(companyUrl).then((data) => {
                $ = cheerio.load(data);
                company = this.parseCompany($, companyUrl);
              }).catch(e => {
                this.context.logger.error(this.name, e);
              });
            }
            if (vacancy && company) {
              await this.vacancyManager.add(company, vacancy);
            }
          }
        }).catch(e => {
          this.context.logger.error(this.name, e);
        });
    }
  }
  getInterface() {
    return Object.freeze({
      getName: () => this.name,
      getScanTimeout: () => utils.getTimeout(this.config.timeouts.mainLoop),
      execute: async () => await this.execute()
    });
  }
}

const keywords = [
  'java',
  'python',
  '.net',
  'ruby',
  'php',
  'ios',
  'macos',
  'c++',
  'android',
  'qa',
  'front end',
  'back end',
  'project manager',
  'golang',
  'scala',
  'erlang',
  'swift',
  'react',
  'react native',
  'angular',
  'nodejs',
  'cordova',
  'devops',
  'sre',
  'data science',
  'unity',
  'embedded',
  'security',
  'blockchain',
  'system administrator',
  'support',
  'dba'
];

module.exports = { baseScraper };
