'use strict';

// read config
const config = {
  actor01: {
    timeouts: {
      mainLoop: {
        middle: 6 * 60 * 60 * 1000, // every 6 hours
        deviation: 10
      },
      subLoop: {
        //middle: 5 * 60 * 1000, // every 5 minutes
        middle: 10 * 1000, // every 10 seconds
        deviation: 20
      }
    }
  }
};

// utils
const logger = require('./logger').create(3);
const utils = require('./utils');

// Create main context
const context = require('./context').create({
  logger: logger,
  utils: utils,
  entities: require('./entities'),
  rules: require('./rules'),
  adapters: require('./adapters'),
  drivers: require('./drivers')
});

// create persistent storage and main service
context.add({db: context.drivers.createDb(context.clone('logger'))});
const service = context.drivers.createService(context.clone('logger', 'utils'), 'org.attlas.services.scraper.worker');


// take care about grateful exit
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(sig => {
  process.on(sig, () => {
    service.shutdown().
    then(() => process.exit(0)).
    catch(e => { console.error(e); process.exit(1); })
  });
});

// run scan cycle
(async () => {
  try {
    await context.db.connect('mongodb://46.101.7.84:27017/', 'scraper', 'scraper', 'scraper');
    await service.init() ? service.run([
      context.adapters.createScraper01(context.clone('logger', 'utils', 'db', 'rules', 'entities'), config.actor01)/*,
      context.adapters.createScraper02(context.clone('logger', 'utils', 'db', 'rules', 'entities'), config.actor01),
      context.adapters.createScraper03(context.clone('logger', 'utils', 'db', 'rules', 'entities'), config.actor01)*/
    ]) : service.shutdown();
  } catch (e) {
    console.log(e);
  }
})();

