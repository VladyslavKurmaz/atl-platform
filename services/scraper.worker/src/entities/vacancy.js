'use strict';

const baseEntity = require('./baseEntity');

class vacancy extends baseEntity {
  constructor(context) {
    super(context);
  }
}

module.exports.builder = () => (context, {url}) => {
  //context.logger.info(url);
  return Object.freeze({
  });
}
/*
module.exports.builder = () => (
  logger,
  utils,
  {
    url,
    company,
    publishDate,
    title,
    text,
    location,
    salary,
    dateOfListing = Date.now()
  }) => {
  // validate input
  if (!utils.validator.isValidUrl(url)) {
    throw new Error('Vacancy must have a valid url.')
  }
  if (!utils.validator.isValidCompany(company)) {
    throw new Error('Vacancy must have an company.')
  }
  if (!utils.validator.isValidDate(publishDate)) {
    throw new Error('Publish date is incorrect.')
  }
  if (!utils.validator.isValidText(title)) {
    throw new Error('Title must include at least one character of text.')
  }
  if (!utils.validator.isValidText(text)) {
    throw new Error('Text must include at least one character of text.')
  }
  if (!validator.isValidLocation(location)) {
    throw new Error('Text must be defined.')
  }
  if (!validator.isValidCurrency(salary)) {
    throw new Error('Salary must be in valid format.')
  }
  const vacancy = new vacancy(logger);
  return Object.freeze({
    getId: () => vacancy.getId()
  });
}
*/