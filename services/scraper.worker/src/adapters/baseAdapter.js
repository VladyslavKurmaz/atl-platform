'use strict';

class baseAdapter {
  constructor(logger, utils, db, config, name) {
    this.logger = logger;
    this.utils = utils;
    this.db = db;
    this.config = config;
    this.name = name;
  }

  getEntry() {
    return {
      timeout: this.config.timeouts.mainLoop,
      execute: async () => await this.execute()
    };
  }
}

module.exports = baseAdapter;
