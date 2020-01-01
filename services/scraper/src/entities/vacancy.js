'use strict';

const baseEntity = require('./baseEntity');

class vacancy extends baseEntity {
  constructor(context) {
    super(context);
  }
}

module.exports.builder = () => (
  context,
  {
    url,
    date,
    title,
    text,
    location,
    salary
  }
  ) => {
  // validate input
  if (!context.utils.validator.isValidUrl(url)) {
    throw new Error('Vacancy must have a valid url.')
  }
  if (!context.utils.validator.isValidDate(date)) {
    throw new Error('Publish date is incorrect.')
  }
  if (!context.utils.validator.isValidText(title)) {
    throw new Error('Title must include at least one character of text.')
  }
  if (!context.utils.validator.isValidText(text)) {
    throw new Error('Text must include at least one character of text.')
  }
  if (!context.utils.validator.isValidLocation(location)) {
    throw new Error('Text must be defined.')
  }
  if (!context.utils.validator.isValidCurrency(salary)) {
    throw new Error('Salary must be in valid format.')
  }
  return Object.freeze({
    getUrl: () => url,
    getDate: () => date,
    getTitle: () => title,
    getText: () => text,
    getLocation: () => location,
    getSalary: () => salary
  });
}
