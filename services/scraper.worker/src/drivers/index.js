'use strict';

module.exports = {
  createService: require('./service').builder(),
  createDb: require('./docs-db').builder()
}
