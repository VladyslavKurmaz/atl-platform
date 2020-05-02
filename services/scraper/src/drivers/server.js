'use strict';

const baseItem = require('../baseItem');

class server extends baseItem {

  constructor(context) {
    super(context);
    this.express = require('express');
    this.bodyParser = require('body-parser');
    this.app = this.express();
    this.app.use(this.bodyParser.json());

  }

  async server(port) {
    const conext = this.context.clone('logger', 'utils', 'db', 'rules', 'entities');
    const reports = this.context.rules.createReportManager(cntx.duplicate());

    this.app.post('/goals/reports', (req, res) => {
      res.json({success:true, data:[]});
    });
    this.app.listen(port, () => {
      this.context.logger.info(`Listening on port ${port}`);
    });
        
  }
}

module.exports.builder = () => (context) => {
  const httpServer = new server(context);
  return Object.freeze({
    server: async (port) => await httpServer.server(port)
  });
}