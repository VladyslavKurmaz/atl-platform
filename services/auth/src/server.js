'use strict';

class Server {
  /*
  *
  *
  */
  constructor(logger) {
    this.logger = logger;
    this.dotenv = require('dotenv').config();
    this.express = require('express')
    this.app = this.express();
    this.http = require('http');
    this.httpServer = null;
    this.https = require('https');
    this.httpsServer = null;
    //
    this.params = require('./utils/params').create();
    this.jsv = require('./utils/jsv').create(this.logger, { allErrors:true, removeAdditional:'all' });
    this.reply = require('./utils/reply').create();
    //
    this.stats = require('simple-stats-server')();
  }

  /*
  * Helper function which returns middleware to validate json according to schema
  * @schemaId - previously compiled schema id
  */
  validateReqBody(schemaId) {
    return (req, res, next) => {
      if (!this.jsv.validate(schemaId, req.body)){
        return res.status(400).json(this.reply.fail(this.jsv.errors(schemaId)));
      }
      next();
    };
  }

  /*
  *
  *
  */
  init(env) {
    this.logger.trace('Initialize server');
    this.params.load({ 
      key:        { env:'COMPONENT_ID',                   def: 'org.talan.nodejs',  delim: null },
      version:    { env:'COMPONENT_VERSION',              def: '0.1.0',             delim: null },
      host:       { env:'COMPONENT_PARAM_HOST',           def: 'localhost',         delim: null },
      lstn:       { env:'COMPONENT_PARAM_LSTN',           def: '0.0.0.0',           delim: null },
      port:       { env:'COMPONENT_PARAM_PORT',           def: 9081,                delim: null },
      ports:      { env:'COMPONENT_PARAM_PORTS',          def: 9444,                delim: null },
      certs:      { env:'COMPONENT_PARAM_SSL_CERTS',      def: null,                delim: ',' },
      whitelist:  { env:'COMPONENT_PARAM_CORS_WHITELIST', def: '*',                 delim: ',' }
    }, env);
    //--------------------------------------------------------------------------
    // json body parser
    const bodyParser = require('body-parser');
    this.app.use(bodyParser.json());
    this.app.use((err, req, res, next) => {
      if (err instanceof SyntaxError) {
        return res.status(400).json(this.reply.fail(`input json syntax error: '${err.message}'`));
      } else {
        next(err);
      }
    });
    //--------------------------------------------------------------------------
    //
    const helmet = require('helmet');
    this.app.use(helmet());
    //--------------------------------------------------------------------------
    //
    const session = require('express-session'); 
    const store = require('session-file-store')(session);
    const randomstring = require("randomstring");
    this.app.use(session({
      cookie:{
        // domain: null,
        // expires: null,
        httpOnly: true,
        // maxAge: null,
        maxAge: null,
        path: '/',
        // sameSite: null,
        secure: false // NOTE https enable sites, recommended
      },
      // genid: null,
      name : this.params.key,
      // proxy: null,
      resave: true,
      // rolling: false,
      saveUninitialized: true,
      secret: randomstring.generate({length: 32, charset: 'alphabetic'}),
      store: new store({}),
      // unset: 'keep'
    }));

    //--------------------------------------------------------------------------
    //
    const cors = require('cors');
    this.app.use(cors({
      origin: (origin, callback) => {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        //
        if ((this.params.whitelist.indexOf(origin) !== -1) || (this.params.whitelist == '*')) {
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

    //--------------------------------------------------------------------------
    // TODO: add rate limits

    //--------------------------------------------------------------------------
    // Status endpoint
    this.app.use('/stats', this.stats);

    //--------------------------------------------------------------------------
    // Healthcheck endpoint
    // json validator for healthcheck POST request
    this.jsv.compile('hcSchema',
      { 
        "title": "Healthcheck options schema",
        "description": "",
        "type": "object",
        "properties": {
          "timeout": {
            "type": "number",
            "description": "Status update timeout"
          }
        },
        "required": ["timeout"]
      }
    );
    this.app.route('/healthcheck')
      .get( (req, res) => {
        return res.json(this.reply.success({}));
      })
      .post(
        this.validateReqBody('hcSchema'),
        (req, res) => {
          return res.json(this.reply.success({key:"value"}));
        }
      );

    //--------------------------------------------------------------------------
    // TODO: load available APIs
    this.app.route('/api/v1/contacts')
    .get((req, res) => {
      console.log(req.query);
      return res.json(this.reply.success([
        {
          id: 'linkedin',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'facebook',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'github',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'google',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'stackexchange',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'twitter',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'dropbox',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'slack',
          icon: null,
          authLink: 'http://'
        },
        {
          id: 'company',
          icon: 'data:image/png;base64,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',
          authLink: 'http://'
        }
      ]));
    });

    return true;
  }

  /*
  *
  *
  */
  run() {
    this.httpServer = this.http.createServer(this.app).listen(
      { host: this.params.lstn,
        port: this.params.port
      }, (err) => {
        if (err) {
          this.logger.fatal(err);
        } else {
          const host = this.httpServer.address().address;
          const port = this.httpServer.address().port;
          this.logger.info(`Server is listening http://${host}:${port}`);
          this.params.dump(this.logger);
        }
    });


    // this.httpServer = this.https.createServer(options, app).listen(443);
    return this;
  }

  /*
  *
  *
  */
  stop() {
    this.httpServer.close();
    // this.httpsServer.close();
  }
}


module.exports.run = (logger, env) => {
  const server = new Server(logger);
  if (server.init(env)) { 
    return server.run();
  }
  return null;
}

module.exports.run4tests = () => {
  return module.exports.run(require('./utils/logger').create(3), {host: 'localhost', lstn:'localhost', port:6080, ports:6443});
}

/*
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


  // Common modules ============================================================
  //const csrf = require('csurf');
  const randomstring = require("randomstring");

  // [Components] specific modules & constants =================================

  // Express application =======================================================
  // service parameters
  //
  //
  //
  // Session management ========================================================
  // 
  //
  // CSRF =====================================================================
  //
  // app.use(csrf());
  // app.use(function(req, res, next) {
  //   res.locals._csrf = req.csrfToken();
  //   next();
  // });
  //
  //
  // utilities


  // API v1 ====================================================================
  const apiV1 = require('./api/v1/impl')(express, app, jsv, reply, helpers);


  //
  return context;
}
*/