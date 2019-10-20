'use strict';

const { ApiInfo, BaseApi } = require("./..");

class ApiV1 extends BaseApi{

  constructor(server, version, base) {
    super(server, new ApiInfo(version, base.join('/'), server.params.buildEndpoint(base), false, '2019-09-01', null));
  }

  configure() {
    super.configure();

    this.router.route('/contacts')
     // version info
      .get((req, res) => {
        return res.json([]);
    });
  }

}

module.exports.create = (server, version, base) => {
  return new ApiV1(server, version, base);
}