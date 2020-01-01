'use strict';

const baseEntity = require('./baseEntity');

class company extends baseEntity {
  constructor(context) {
    super(context);
  }
}

module.exports.builder = () => (
  context,
  {
    key,
    url,
    name
  }
  ) => {
  // validate input
  if (!context.utils.validator.isValidText(key)) {
    throw new Error('Company key must include at least one character of text.')
  }
  if (!context.utils.validator.isValidUrl(url)) {
    throw new Error('Company must have a valid url.')
  }
  if (!context.utils.validator.isValidText(name)) {
    throw new Error('Company name must include at least one character of text.')
  }
  return Object.freeze({
    getKey: () => key,
    getUrl: () => url,
    getName: () => name
  });
}
