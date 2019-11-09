'use strict';

const factory = require('./../use-cases');

class baseActor {
  constructor(logger, name, config, db) {
    this.logger = logger;
    this.name = name;
    this.config = config;
    this.db = db;
    this.vacancyManager = factory.createVacancyManager(this.logger, this.db);
  }

  getEntry() {
    return {
      timeout: this.config.timeouts.mainLoop,
      execute: async () => await this.execute()
    };
  }
}

module.exports = baseActor;
