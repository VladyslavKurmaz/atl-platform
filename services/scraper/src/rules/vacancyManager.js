'use strict';

const gt = require('google-translate')(process.env.COMPONENT_PARAM_TRANSLATE_API_KEY, {});
const baseRule = require('./baseRule');

class vacancyManager extends baseRule {
  constructor(context) {
    super(context);
    this.cache = [];
  }

  async add(companyDesc, vacancyDesc) {
    /*
    // process master company
    const masterCompanyKey = companyDesc.masterKey;
    const masterCompanyHash = this.context.utils.md5(masterCompanyKey);
    if (!await this.context.db.findCompanyByHash(masterCompanyHash)) {
      // create master company
      const masterCompany = this.context.entities.createCompany(this.context.clone('logger', 'utils'),
        {
          key: masterCompanyKey,
          url: companyDesc.domain,
          name: masterCompanyKey
        });
      await this.context.db.insertCompany({
        id: this.context.utils.getUuid(),
        hash: masterCompanyHash,
        key: masterCompany.getKey(),
        url: masterCompany.getUrl(),
        name: masterCompany.getName(),
        links: {}
      });
    }
    // process company projection
    const company = this.context.entities.createCompany(this.context.clone('logger', 'utils'), companyDesc);
    const cHash = this.context.utils.md5(company.getUrl());
    if (!await this.context.db.findCompanyByHash(cHash)) {
      await this.context.db.insertCompany({
        id: this.context.utils.getUuid(),
        hash: cHash,
        key: company.getKey(),
        url: company.getUrl(),
        name: company.getName(),
        links: {parent: {scope: 'contacts', hash: masterCompanyHash}}
      });
    } else {
      // this.context.logger.info('Skip');
    }
    */
    // process vacancy
    const vacancy = this.context.entities.createVacancy(this.context.clone('logger', 'utils'), vacancyDesc);
    const vHash = this.context.utils.md5(vacancy.getUrl());
    if (!await this.context.db.findVacancyByHash(vHash)) {
      await this.context.db.insertVacancy({
        id: this.context.utils.getUuid(),
        hash: vHash,
        url: vacancy.getUrl(),
        companyKey: companyDesc.masterKey,
        companyDomain: companyDesc.domain,
        date: new Date(vacancy.getDate()),
        title: vacancy.getTitle(),
        text: vacancy.getText(),
        location: await this.translate(vacancy.getLocation()),
        salary: vacancy.getSalary()
      });
    } else {
      // this.context.logger.info('Skip');
    }
  }
  async doTranslate(word) {
    return new Promise( (resolve, reject) => {
      gt.translate(word, 'en', function (err, translation) {
        if (err) {
          reject(err);
        }
        else {
          resolve(translation.translatedText);
        }
      });
    });
  }

  async translate(words) {
    let r = []
    for (const w of words) {
      let t = null;
      if (this.cache[w]) {
        t = this.cache[w];
      } else {
        t = await this.context.db.findTranslation(w);
        if (!t) {
          // request translation API
          t = await this.doTranslate(w);
          if (t) {
            await this.context.db.addTranslation(w, t);
          }
        }
        // cache translation
        if (t) {
          this.cache[w] = t;
        }
      }
      if (t) {
        r.push(t);
      }
    }
    return r;
  }
}

module.exports.builder = () => (context) => {
  const manager = new vacancyManager(context);
  return Object.freeze({
    add: async (companyDesc, vacancyDesc) => await manager.add(companyDesc, vacancyDesc)
  });
}