'use strict';

// read config
const config = {
  actor01: {
    middle: 100000,
    deviation: 10
  },
  actor02: {
    middle: 4000,
    deviation: 10
  }
};

// create persistent storage
const db = require('./drivers/vacancies-db').create();

// create control service
const service = require('./service').create('org.attlas.services.scraper.worker');

// run scan cycle
const factories = require('./interfaces');
service.init() ? service.run([
  factories.createActor01(config.actor01, db).getEntry()
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
