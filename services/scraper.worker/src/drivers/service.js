'use strict';

class service {

  constructor(logger, utils, name) {
    this.logger = logger;
    this.utils = utils;
    this.name = name;
    this.timers = [];
    this.logger.info(`Service ${this.name} started ` + this.utils.getCurDateTimeStr());
  }

  async init() {
    return true;
  }

  async tick(scraper, i) {
    this.logger.info(`Scraper #${i} waked up at ` + this.utils.getCurDateTimeStr());
    await scraper.execute();
    const tm = this.utils.getTimeout(scraper.timeout);
    this.logger.info(`Scraper #${i} will sleep during ${tm} before next scan`);
    this.timers[i] = setTimeout((s, i) => this.tick(s, i), tm, scraper, i);
  }

  async run(scrapers) {
    let i = 0;
    for (const scraper of scrapers) {
      this.timers.push(null);
      await this.tick(scraper, i++);
    }
  }

  async shutdown() {
    this.timers.forEach(e => {
      if (e) {
        clearTimeout(e);
      }
    });
    this.logger.info(`\nService ${this.name} exited ` + this.utils.getCurDateTimeStr() + '\nbye!');
  }
}

module.exports.builder = () => (logger, utils, name) => {
  const srv = new service(logger, utils, name);
  return Object.freeze({
    init: async () => await srv.init(),
    run: async (scrapers) => await srv.run(scrapers),
    shutdown: async () => await srv.shutdown(),
  });
}
