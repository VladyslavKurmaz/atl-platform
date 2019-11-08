'use strict';

const baseUseCase = require('./baseUseCase');

class vacancyManager extends baseUseCase {
  constructor(logger) {
    super(logger);
  }

  async add(desc) {
    console.log(desc);
  }
}

module.exports.factory = () => (logger) => {
  const manager = new vacancyManager(logger);
  return Object.freeze({
    add: async (desc) => await manager.add(desc)
  });
}