'use strict';

module.exports = {
  createVacancyManager: require('./vacancyManager').builder(),
  createReportManager: require('./reportManager').builder()
}