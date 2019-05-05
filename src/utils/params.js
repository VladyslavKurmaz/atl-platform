'use strict';
/*
 * Holds service parameters were read from environment variables
 */
class Params {

  constructor() {
  }

  // load parameters from environment variables or use default values
  load(variables, env) {
    Object.keys(variables).map((k, i) => {
      let v = process.env[variables[k].env];
      if (env[k]) {
        v = env[k];
      }
      if (v != 'undefined' && v){
        if (variables[k].delim) {
          this.set(k, v.split(variables[k].delim));
        } else {
          this.set(k, v);
        }
      } else {
        this.set(k, variables[k].def);
      }
    });
  }

  //
  set(name, value) {
    this[name] = value;
  }

  //
  buildEndpoint(paths, query = null, hash = null) {
    return this. buildEndpointEx(this.host, this.port, paths, query, hash);
  }

  //
  buildEndpointEx(host, port, paths, query = null, hash = null) {
    // TODO implement processing for query and hash
    const r = paths.slice();
    r.unshift(`http://${host}:${port}`);
    return r.join('/');
  }
  //
  dump(logger) {
    logger.info('Parameters:');
    for(var n in this) {
      if (typeof this[n] !== "function") {
        logger.info(`* ${n}: `, this[n]);
      }
    }
  }
}

module.exports.create = () => {
  return new Params();
}
