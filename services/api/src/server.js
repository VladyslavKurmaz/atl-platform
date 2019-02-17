'use strict';

module.exports = function(){
  const fs = require('fs');
  const path = require('path');
  //
  const context = require('./context').create(console);
  //
  context.configure();

  // load available APIs
  console.log('Loading available APIs:');
  const apiLocation = './src/api';
  fs.readdirSync(apiLocation).forEach(file => {
    if(fs.lstatSync(path.join(apiLocation, file)).isDirectory()) {
      console.log(`* ${file}`);
      require(`./api/${file}`).create(context, file, ['', 'api', file].join('/')).configure();
    }
  })
  
  // run server
  context.run();

/*
  // Common modules ============================================================
  const helmet = require('helmet');
  const session = require('express-session'); 
  const store = require('session-file-store')(session);
  //const csrf = require('csurf');
  const cors = require('cors');
  const randomstring = require("randomstring");

  // [Components] specific modules & constants =================================

  // Express application =======================================================
  // service parameters
  //
  //
  // Helmet ====================================================================
  //
  app.use(helmet());
  //
  // Session management ========================================================
  // 
  app.use(session({
    cookie:{
      // domain: null,
      // expires: null,
      httpOnly: true,
      // maxAge: null,
      maxAge: null,
      path: '/',
      // sameSite: null,
      secure: false
    },
    // genid: null,
    name : app.params.key,
    // proxy: null,
    resave: true,
    // rolling: false,
    saveUninitialized: true,
    secret: secretString,
     store: new store({}),
    // unset: 'keep'
  }));
  //
  // CSRF =====================================================================
  //
  // app.use(csrf());
  // app.use(function(req, res, next) {
  //   res.locals._csrf = req.csrfToken();
  //   next();
  // });
  //
  app.use(cors({
    origin: function (origin, callback) {
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      //
      const wl = app.params.whitelist.split(',');
      if (wl.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      let msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: 'Content-Type,Content-Length,Authorization,X-Requested-With,*',
    // exposedHeaders: '',
    credentials: true,
    // maxAge: null,
    preflightContinue: false,
    optionsSuccessStatus: 200
  }));
  //
  // utilities


  // API v1 ====================================================================
  const apiV1 = require('./api/v1/impl')(express, app, jsv, reply, helpers);

*/
  //
  return context;
}
