'use strict';

const http = require("http");
const dotenv = require('dotenv').config();
const url = `http://localhost:${process.env.COMPONENT_PARAM_PORT}/healthcheck`;

const request = http.get({
  hostname: 'localhost',
  port: process.env.COMPONENT_PARAM_PORT,
  path: '/healthcheck',
  timeout: 2000,
  agent: false
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode == 200) {
        process.exit(0);
    }
    else {
        process.exit(1);
    }
});

request.on('error', function(err) {  
    console.log('ERROR');
    process.exit(1);
});

request.end();  