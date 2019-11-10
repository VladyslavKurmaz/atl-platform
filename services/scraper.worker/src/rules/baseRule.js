'use strict';

class baseUseCase {
  constructor(logger, utils, db) {
    this.logger = logger;
    this.utils = utils;
    this.db = db;
  }
}

module.exports = baseUseCase;