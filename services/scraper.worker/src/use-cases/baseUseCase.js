'use strict';

class baseUseCase {
  constructor(logger, db) {
    this.logger = logger;
    this.db = db;
  }
}

module.exports = baseUseCase;