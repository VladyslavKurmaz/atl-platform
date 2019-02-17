'use strict';
/*
 * Holds service parameters were read from environment variables
 */
class Params {

  constructor() {
  }

  // load parameters from environment variables or use default values
  load(variables) {
    Object.keys(variables).map((k, i) => {
      const v = process.env[variables[k].env];
      if (v != 'undefined' && v){
        this[k] = v;
      } else {
        this[k] = variables[k].def;
      }
    });
  }

  //
  set(name, value) {
    this[name] = value;
  }

  //
  buildEndpoint(path, query = null, hash = null) {
    // TODO use buildEndpointEx insead
    return `http://${this.host}:${this.port}${path}`;
  }

  //
  buildEndpointEx(host, port, paths, query = null, hash = null) {
    // TODO implement processing for query and hash
    const r = paths.slice();
    r.unshift(`http://${host}:${port}`);
    return r.join('/');
  }
  //
  dump(cout) {
    cout.log(`Component [${this.key}]`);
    cout.log('Environment:');
    for(var n in this) {
      if (typeof this[n] !== "function") {
        console.log(`* ${n}: ${this[n]}`);
      }
    }
  }
};

module.exports.create = () => {
  return new Params();
}
