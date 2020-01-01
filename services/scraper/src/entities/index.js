'use strict';

module.exports = {
  createCompany: require('./company').builder(),
  createVacancy: require('./vacancy').builder()
}
