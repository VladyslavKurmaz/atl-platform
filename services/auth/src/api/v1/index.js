'use strict';
const { ApiInfo, BaseApi } = require("./..");

class ApiV1 extends BaseApi{

  constructor(context, version, base) {
    super(context, new ApiInfo(version, base, context.params.buildEndpoint(base), false, '2019-02-04', null));
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

module.exports.create = (context, version, base) => {
  return new ApiV1(context, version, base);
}
