'use strict';

const utils = require('./utils');

class service {

  constructor(logger, name) {
    this.logger = logger;
    this.name = name;
    this.timers = [];
    this.logger.info(`Service ${this.name} started ` + utils.getCurDateTimeStr());
  }

  init() {
    return true;
  }

  async tick(scraper, i) {
    this.logger.info(` * service ${this.name} waked up at ` + utils.getCurDateTimeStr());
    await scraper.execute();
    const tm = utils.getTimeout(scraper.timeout);
    this.logger(`Scraper #${i} sleep during ${tm} before next scan`);
    this.timers[i] = setTimeout((s, i) => this.tick(s, i), tm, scraper, i);
  }

  async run(scrapers) {
    let i = 0;
    for (const scraper of scrapers) {
      this.timers.push(null);
      await this.tick(scraper, i++);
    }
  }

  shutdown(done) {
    this.timers.forEach(e => {
      if (e) {
        clearTimeout(e);
      }
    });
    this.logger.info(`\nService ${this.name} exited ` + utils.getCurDateTimeStr() + '\nbye!');
    done();
  }
}

module.exports.create = (logger, name) => {
  return new service(logger, name);
}
