'use strict';

const utils = require('./../utils');
const baseUseCase = require('./baseUseCase');

class vacancyManager extends baseUseCase {
  constructor(logger, db) {
    super(logger, db);
  }

  async add(desc) {
    await this.db.insert({id: utils.getUuid(), ...desc});
  }
}

module.exports.factory = () => (logger, db) => {
  const manager = new vacancyManager(logger, db);
  return Object.freeze({
    add: async (desc) => await manager.add(desc)
  });
}