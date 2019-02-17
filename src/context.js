'use strict';

class Context {

  constructor(logger) {
    this.logger = logger;
    this.express = require('express')
    this.app = this.express();
    this.dotenv = require('dotenv').config();
    this.stats = require('simple-stats-server')();
    //
    this.server = null;
    this.jsv = require('./utils/jsv').create(this.logger, { allErrors:true, removeAdditional:'all' });
    this.reply = require('./utils/reply').create();
    this.helpers = require('./utils/helpers').create(this.logger, this.jsv, this.reply);
    this.params = require('./utils/params').create();

  }

  configure() {
    this.params.load({ 
      key:        { env:'COMPONENT_ID',                   def: 'org.talan.nodejs' },
      version:    { env:'COMPONENT_VERSION',              def: '0.1.0' },
      host:       { env:'COMPONENT_PARAM_HOST',           def: 'localhost' },
      lstn:       { env:'COMPONENT_PARAM_LSTN',           def: '0.0.0.0' },
      port:       { env:'COMPONENT_PARAM_PORT',           def: 9081 },
      ports:      { env:'COMPONENT_PARAM_PORTS',          def: 9444 },
      whitelist:  { env:'COMPONENT_PARAM_CORS_WHITELIST', def: '*' }
    });

    // parsing input json
    const bodyParser = require('body-parser');
    this.app.use(bodyParser.json());
    this.app.use(function (err, req, res, next) {
      if (err instanceof SyntaxError) {
        return res.status(400).json(this.reply.fail(`Input json Syntax error: '${err.message}'`));
      } else {
        next(err);
      }
    }.bind(this));

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

    /*
    // constants
    const secretString = randomstring.generate({length: 32, charset: 'alphabetic'});
    */
    // Status endpoint
    this.app.use('/stats', this.stats);

    // Healthcheck endpoint
    this.app.route('/healthcheck')
      .get( (req, res) => {
        // console.log(req.session);
        return res.json(this.reply.success({}));
      })
      .post(
        this.helpers.validateReqBody('hcSchema'),
        (req, res) => {
          return res.json(this.reply.success({key:"value"}));
        }
      );
  }

  run() {
    // start http server
    this.server = this.app.listen(this.params.port, this.params.lstn, () => {
      const host = this.server.address().address;
      const port = this.server.address().port;
      this.logger.log(`Server is listening http://${host}:${port}`);
      this.params.dump(this.logger);
    });
  }

}

module.exports.create = (logger) => {
  return new Context(logger);
}
