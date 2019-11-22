
const entities = require('.');

const logger = require('./../logger').create(3);
const utils = require('./../utils');
const context = require('./../context');

let testContext = null;
beforeEach(() => {
  testContext = context.create({
    logger: logger,
    utils: utils
  });
 });

afterEach(() => {
  testContext = null;
});

test('Create empty entity', () => {
  const vacancy = entities.createVacancy(testContext, {url:''});
  expect(vacancy).toBeDefined();
});