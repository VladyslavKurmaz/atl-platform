'use strict';

class ApiInfo {
  constructor(version, base, ref, depricated, startDate, endDate) {
    this.version = version;
    this.base = base;
    this.ref = ref;
    this.depricated = depricated;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

class BaseApi {

  constructor(context, info) {
    this.context = context;
    this.info = info;
    this.router = this.context.express.Router({mergeParams: true});
  }

  configure() {
    this.context.logger.log(`Configuring: ${this.info.base}`);
    // api endpoint info
    this.router.route('/')
     // version info
      .get((req, res) => {
        return res.json(this.context.reply.success(this.info));
    });

    this.context.app.use(this.info.base, this.router);
  }

}

module.exports = {
  ApiInfo,
  BaseApi
}
