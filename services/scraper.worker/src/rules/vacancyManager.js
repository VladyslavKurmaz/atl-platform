'use strict';

const baseRule = require('./baseRule');

class vacancyManager extends baseRule {
  constructor(context) {
    super(context);
  }

  async add(desc) {
    const vacancy = this.context.entities.createVacancy(this.context, desc);
    await this.context.db.insert({id: this.context.utils.getUuid(), ...desc});
  }
}

module.exports.builder = () => (context) => {
  const manager = new vacancyManager(context);
  return Object.freeze({
    add: async (desc) => await manager.add(desc)
  });
}