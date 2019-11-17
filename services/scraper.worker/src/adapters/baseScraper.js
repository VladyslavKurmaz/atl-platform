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
    for (const kw of shuffle(keywords.slice(9, 10))) {
      //
      this.context.logger.info(`${this.name} lookups keyword(s): ${kw}`);

      await this.doRequest(this.getSearchUrl(kw)).
        then(async (data) => {
          // get search results
          let $ = cheerio.load(data);
          let items = this.parseSearch($);
          // scan vacancies
          let i = 0;
          const count = items.length;
          for (const e of items) {
            i++;
            this.context.logger.info(`${this.name} executes step ${i} of ${count}, ${e}`);
            let vacancy = null;
            await this.doRequest(e).then((data) => {
              $ = cheerio.load(data);
              vacancy = this.parseVacancy($);
            }).catch(e => {
              this.context.logger.error(this.name, e);
            });
            if (vacancy) {
              vacancy.url = e;
              await this.vacancyManager.add(vacancy);
            }
            const tm = utils.getTimeout(this.config.timeouts.subLoop);
            this.context.logger.info(`${this.name} will sleep for ${tm} before next request`);
            await delay(tm);
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

module.exports = { baseScraper };
