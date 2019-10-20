'use strict';

class apiInfo {
  constructor(version, base, ref, startDate, endDate) {
    this.version = version;
    this.base = base;
    this.ref = ref;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

class baseApi {

  constructor(server, info) {
    this.server = server;
    this.info = info;
    this.router = this.server.express.Router({mergeParams: true});
  }

  getInfo() {
    return this.info;
  }

  configure() {
    this.server.logger.trace(`Configuring: ${this.info.base}`);
    // api endpoint info
    this.router.route('/')
     // version info
      .get((req, res) => {
        return res.json(this.server.reply.success(this.info));
    });

    this.server.app.use('/api/v1'/*this.info.base*/, this.router);
  }

}

module.exports = {
  apiInfo,
  baseApi
}
