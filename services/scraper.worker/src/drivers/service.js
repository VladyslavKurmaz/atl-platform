'use strict';

const baseItem = require('./../baseItem');

class service extends baseItem {

  constructor(context, name) {
    super(context)
    this.name = name;
    this.timers = [];
    this.context.logger.info(`Service ${this.name} started ` + this.context.utils.getCurDateTimeStr());
  }

  async init() {
    return true;
  }

  async tick(scraper, i) {
    const scraperName = scraper.getName();
    this.context.logger.info(`Scraper ${scraperName} waked up at ` + this.context.utils.getCurDateTimeStr());
    await scraper.execute();
    const tm = scraper.getScanTimeout();
    this.context.logger.info(`Scraper ${scraperName} will sleep during ${tm} before next scan`);
    this.timers[i] = setTimeout((s, i) => this.tick(s, i), tm, scraper, i);
  }

  async run(scrapers) {
    let i = 0;
    for (const scraper of scrapers) {
      this.timers.push(null);
      this.tick(scraper, i++);
    }
    // Do we need wait for all functionality here ?
    // await Promise.all();
  }

  async shutdown() {
    this.timers.forEach(e => {
      if (e) {
        clearTimeout(e);
      }
    });
    this.context.logger.info(`\nService ${this.name} exited ` + this.context.utils.getCurDateTimeStr() + '\nbye!');
  }
}

module.exports.builder = () => (context, name) => {
  const srv = new service(context, name);
  return Object.freeze({
    init: async () => await srv.init(),
    run: async (scrapers) => await srv.run(scrapers),
    shutdown: async () => await srv.shutdown(),
  });
}
