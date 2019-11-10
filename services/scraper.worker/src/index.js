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
        deviation: 10
      }
    }
  }
};

// utils
const logger = require('./logger').create(3);
const utils = require('./utils');

// Abstaract factories 
const entities = require('./entities');
const rules = require('./rules');
const adapters = require('./adapters');
const drivers = require('./drivers');

// create persistent storage adn nain service
const db = drivers.createDb(logger);
const service = drivers.createService(logger, utils, 'org.attlas.services.scraper.worker');

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
    await service.init() ? service.run([
      adapters.createActor01(logger, utils, db, config.actor01, rules).getEntry()
    ]) : service.shutdown();
  } catch (e) {
    console.log(e);
  }
})();

