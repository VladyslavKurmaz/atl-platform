'use strict';

// server
const server = require('./server').run(require('./utils/logger').create(3), {});
