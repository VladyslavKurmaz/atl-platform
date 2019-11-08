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
        middle: 10 * 1000, // every 5 minutes
        deviation: 10
      }
    }
  }
};

// logger
const logger = require('./logger').create(3);

// create persistent storage
const db = require('./drivers/vacancies-db').create(logger);

// create control service
const service = require('./service').create(logger, 'org.attlas.services.scraper.worker');

// run scan cycle
const factory = require('./interfaces');
service.init() ? service.run([
  factory.createActor01(logger, config.actor01, db).getEntry()
]) : service.shutdown();


// take care about grateful exit
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(sig => {
  process.on(sig, () => {
    service.shutdown((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
});
