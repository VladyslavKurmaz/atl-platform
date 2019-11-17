'use strict';

const cuid = require('cuid');
const crypto = require('crypto');
const url = require('url');

module.exports = {
  getTimeout: ({ middle, deviation }) => {
    const delta = middle * deviation / 100;
    const mi = Math.ceil(middle - delta);
    const ma = Math.floor(middle + delta);
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;    
  },
  getCurDateTimeStr: () => {
    return (new Date()).toString();
  },
  getUuid: () => {
    return cuid();
  },
  md5: (text) => {
    return crypto
      .createHash('md5')
      .update(text, 'utf-8')
      .digest('hex')
  },
  cleanupUrl(u) {
    const source = url.parse(u);
    source.hash = '';
    source.search = '';
    return url.format(source);
  },
  validator: {
    isValidUrl: (url) => {
      return true;
    },
    isValidCompany: (company) => {
      return true;
    },
    isValidDate: (date) => {
      return true;
    },
    isValidText: (text) => {
      return (!title || text.title < 1);
    },
    isValidLocation: (location) => {
      return true;
    },
    isValidCurrency: (salary) => {
      return true;
    }
  }
}