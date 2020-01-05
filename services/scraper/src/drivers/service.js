'use strict';

const schedule = require('node-schedule');
const baseItem = require('./../baseItem');

class service extends baseItem {

  constructor(context, name) {
    super(context)
    this.name = name;
    this.timers = [];
    this.reportSheduler = null;
    this.context.logger.info(`Service ${this.name} started ` + this.context.utils.getCurDateTimeStr());
  }

  async init() {
    return true;
  }

  async tick(scraper, i) {
    const scraperName = scraper.getName();
    this.context.logger.info(`${scraperName} waked up at ` + this.context.utils.getCurDateTimeStr());
    await scraper.execute();
    const tm = scraper.getScanTimeout();
    this.context.logger.info(`${scraperName} will sleep during ${tm} before next scan`);
    this.timers[i] = setTimeout((s, i) => this.tick(s, i), tm, scraper, i);
  }

  async run(config) {
    // run scrapers
    const cntx = this.context.clone('logger', 'utils', 'db', 'rules', 'entities');
    const scrapers = [
      /*this.context.adapters.createScraper01(cntx.duplicate(), config.scrapers.actor01)/*,
      this.context.adapters.createScraper02(cntx.duplicate(), config.scrapers.actor01),
      this.context.adapters.createScraper03(cntx.duplicate(), config.scrapers.actor01)*/
    ]
    let i = 0;
    for (const scraper of scrapers) {
      this.timers.push(null);
      this.tick(scraper, i++);
    }
    // run report engine
    const report = this.context.rules.createReportManager(cntx.duplicate());
    await report.calculate();
    this.reportSheduler = schedule.scheduleJob(config.reports.scheduling, async () => {
      await report.calculate();
    });

    // Do we need wait for all functionality here ?
    // await Promise.all();

  }

  async shutdown() {
    this.timers.forEach(e => {
      if (e) {
        clearTimeout(e);
      }
    });
    if (this.reportSheduler) {
      this.reportSheduler.cancel();
    }
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
