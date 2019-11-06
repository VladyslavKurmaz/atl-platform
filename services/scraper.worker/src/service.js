'use strict';

class service {

  constructor(name) {
    console.log(` * service ${name} started ` + (new Date()).toString());
    this.name = name;
    this.timers = [];
  }

  getTimeout(middle, deviation) {
    const delta = middle * deviation / 100;
    const mi = Math.ceil(middle - delta);
    const ma = Math.floor(middle + delta);
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;
  }

  init() {
    return true;
  }

  async tick(scraper, i) {
    await scraper.execute();
    const tm = this.getTimeout(scraper.middle, scraper.deviation);
    console.log(`#${i} sleep for ${tm}`);
    this.timers[i] = setTimeout((s, i) => this.tick(s, i), tm, scraper, i);
  }

  async run(scrapers) {
    let i = 0;
    for (const scraper of scrapers) {
      this.timers.push(null);
      await this.tick(scraper, i++);
    }
  }

  shutdown(done) {
    this.timers.forEach(e => {
      if (e) {
        clearTimeout(e);
      }
    });
    console.log(`\n * service ${this.name} exited ` + (new Date()).toString() + '\nbye!');
    done();
  }
}

module.exports.create = (name) => {
  return new service(name);
}
