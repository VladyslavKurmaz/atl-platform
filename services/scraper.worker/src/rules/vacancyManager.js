'use strict';

const baseRule = require('./baseRule');

class vacancyManager extends baseRule {
  constructor(context) {
    super(context);
  }

  async add(desc) {
    // process company

    // process vacancy
    const vacancy = this.context.entities.createVacancy(this.context.clone('logger', 'utils'), desc);
    const hash = this.context.utils.md5(vacancy.getUrl());
    if (!await this.context.db.findByHash(hash)) {
      await this.context.db.insert({
        id: this.context.utils.getUuid(),
        hash: hash,
        url: vacancy.getUrl(),
        date: new Date(vacancy.getDate()),
        title: vacancy.getTitle(),
        text: vacancy.getText(),
        location: vacancy.getLocation(),
        salary: vacancy.getSalary()
      });
    } else {
      this.context.logger.info('Skip');
    }
  }
}

module.exports.builder = () => (context) => {
  const manager = new vacancyManager(context);
  return Object.freeze({
    add: async (desc) => await manager.add(desc)
  });
}