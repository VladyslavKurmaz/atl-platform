'use strict';
/*
 * Cache for compiled schemas + validate
 */
class Jsv {

  constructor(logger, options) {
    this.logger = logger;
    const Ajv = require('ajv');
    this.ajv = new Ajv(options);
    this.cache = {};
  }

  //
  compile(id, schema) {
    if (!this.isCompiled(id)) {
      try {
        this.cache[id] = this.ajv.compile(schema);
      } catch (e) {
        this.logger.log(e);
        return false;
      }
    }
    return (this.isCompiled(id));
  }

  validate(id, data) {
    return this.cache[id](data);
  }

  errors(id) {
    return this.cache[id].errors;
  }

  isCompiled(id) {
    return (this.cache[id] != null);
  }
};

module.exports.create = (logger, options) => {
  return new Jsv(logger, options);
}
