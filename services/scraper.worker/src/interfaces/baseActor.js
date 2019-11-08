'use strict';

const factory = require('./../use-cases');

class baseActor {
  constructor(logger, config, db) {
    this.getEntry.logger = logger;
    this.config = config;
    this.db = db;
    this.vacancyManager = factory.createVacancyManager(this.logger);
  }

  getEntry() {
    return {
      timeout: this.config.timeouts.mainLoop,
      execute: async () => await this.execute()
    };
  }
}

module.exports = baseActor;
