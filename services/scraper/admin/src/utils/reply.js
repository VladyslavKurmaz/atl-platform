'use strict';
/*
 * Helper class aims to contruct API response
 */

class Reply {

  constructor() {
  }

  success(data, refs = null) {
    return { success:true, data:data, refs:refs };
  }

  fail(errors) {
    return { success:false, errors:errors };
  }

}

module.exports.create = () => {
  return new Reply();
}
