'use strict';

const schedule = require('node-schedule');
const baseItem = require('./../baseItem');

class service extends baseItem {

  constructor(context, name) {
    super(context)
    this.name = name;
    this.jobs = [];
    this.context.logger.info(`Service ${this.name} started ` + this.context.utils.getCurDateTimeStr());
  }

  async init() {
    return true;
  }

  async run(config) {
    // run scrapers
    const cntx = this.context.clone('logger', 'utils', 'db', 'rules', 'entities');
    const scrapers = [
      this.context.adapters.createScraper01(cntx.duplicate(), config.scrapers.actor01.config)/*,
      this.context.adapters.createScraper02(cntx.duplicate(), config.scrapers.actor01.config),
      this.context.adapters.createScraper03(cntx.duplicate(), config.scrapers.actor01.config)*/
    ]
    // await scrapers[0].execute();
    for (const scraper of scrapers) {
      this.jobs.push(
        schedule.scheduleJob(config.scrapers.actor01.scheduling, async () => {
          const scraperName = scraper.getName();
          this.context.logger.info(`${scraperName} waked up at ` + this.context.utils.getCurDateTimeStr());
          await scraper.execute();
        })
      );
    }
    // run report engine
    const reportsManager = this.context.rules.createReportManager(cntx.duplicate());
    //reportsManager.calculateWeeklyReport();
    const reports = [
      {scheduling: config.reports.weekly.scheduling, caclulate: async () => await reportsManager.calculateWeeklyReport()},
      {scheduling: config.reports.monthly.scheduling, caclulate: async () => await reportsManager.calculateMonthlyReport()}
    ];
    //
    for (const report of reports) {
      this.jobs.push(
        schedule.scheduleJob(report.scheduling, async () => {
          await report.caclulate();
        })
      );
    }
  }

  async shutdown() {
    for (const job of this.jobs) {
      job.cancel();
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
