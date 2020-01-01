'use strict';

// read config
const config = {
  scrapers: {
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
  },
  reports: {
    scheduling: {
      hour: 23,
      minute: 0,
      dayOfWeek: 0
    }
  }
};

// load environment variable from .env file
const dotenv = require('dotenv').config();

// Create main context
const context = require('./context').create({
  logger: require('./logger').create(3),
  utils: require('./utils'),
  adapters: require('./adapters'),
  rules: require('./rules'),
  entities: require('./entities')
});

// create persistent storage and main service
const drivers = require('./drivers');
context.add({db: drivers.createDb(context.clone('logger'))});
const service = drivers.createService(context.clone('logger', 'utils', 'db', 'adapters', 'rules', 'entities'), process.env.COMPONENT_ID);

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
    let connected = false;
    while (!connected) {
      context.logger.info('Connecting to DB');
      try {
        connected = await context.db.connect(
          process.env.COMPONENT_PARAM_MONGO_HOST,
          process.env.COMPONENT_PARAM_MONGO_PORT,
          process.env.COMPONENT_PARAM_MONGO_USER,
          process.env.COMPONENT_PARAM_MONGO_PASS,
          process.env.COMPONENT_PARAM_MONGO_DBNAME
        );
      } catch (e) {
        context.logger.error(e);
      }
    }
    //
    await service.init() ? await service.run(config) : await service.shutdown();
  } catch (e) {
    context.logger.error(e);
  }
})();

