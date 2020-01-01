'use strict';

class context {
  constructor(items){
    this.add(items);
  }

  add(items){
    for(const i of Object.keys(items)){
      this[i] = items[i];
    }
  }

  clone(...names) {
    const p = {}
    for(const i of names){
      p[i] = this[i];
    }
    return new context(p);
  }

  duplicate() {
    let names = [];
    for (var name in this) {
      names.push(name);
    }
    return this.clone.apply(this, names);
  }
}

module.exports.create = (items) => {
  return new context(items);
}
