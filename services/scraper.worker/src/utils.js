'use strict';

module.exports = {
  getTimeout: ({ middle, deviation }) => {
    const delta = middle * deviation / 100;
    const mi = Math.ceil(middle - delta);
    const ma = Math.floor(middle + delta);
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;    
  },
  getCurDateTimeStr: () => {
    return (new Date()).toString();
  }
}