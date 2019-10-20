'use strict';

const { apiInfo, baseApi } = require("./..");

class apiV1 extends baseApi{

  constructor(server, version, base) {
    super(server, new apiInfo(version, base.join('/'), server.params.buildEndpoint(base), '2019-09-01', null));
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
  return new apiV1(server, version, base);
}