'use strict';

class baseActor {
  constructor(config, db) {
    this.config = config;
    this.db = db;
  }

  getEntry() {
    return {
      middle: this.config.middle,
      deviation: this.config.deviation,
      execute: () => this.execute()
    };
  }
}

module.exports = baseActor;
