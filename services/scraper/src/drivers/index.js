'use strict';

module.exports = {
  createService: require('./service').builder(),
  createDb: require('./db').builder()
}
