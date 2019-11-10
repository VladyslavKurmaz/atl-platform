'use strict';

const utils = require('./../utils');
const baseRule = require('./baseRule');

class vacancyManager extends baseRule {
  constructor(logger, utils, db) {
    super(logger, utils, db);
  }

  async add(desc) {
    await this.db.insert({id: this.utils.getUuid(), ...desc});
  }
}

module.exports.factory = () => (logger, utils, db) => {
  const manager = new vacancyManager(logger, utils, db);
  return Object.freeze({
    add: async (desc) => await manager.add(desc)
  });
}