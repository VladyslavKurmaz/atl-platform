'use strict';
/*
 * Validate request json body using schema defeinition
 */
class Helpers {

  constructor(logger, jsv, reply) {
    this.logger = logger;
    this.jsv = jsv;
    this.reply = reply;
  }

  validateReqBody(schemaId) {
    return (req, res, next) => {
      if (!this.jsv.validate(schemaId, req.body)){
        return res.status(400).json(this.reply.fail(this.jsv.errors(schemaId)));
      }
      next();
    };
  }
};

module.exports.create = (logger, jsv, reply) => {
  return new Helpers(logger, jsv, reply);
}
