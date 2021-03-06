const fs = require('fs');

const cities = require('cities.json');

const citiesCollection = 'docs.cities';
const mappingsCollection = 'docs.mappings';

module.exports = {
  async up(db, client) {
    //
    await db.collection(citiesCollection).insertMany(cities);
    await db.collection(citiesCollection).insertOne({country : "", name : "Remotely", lat: "0.0", lng: "0.0"});
    await db.collection(citiesCollection).insertOne({country : "", name : "Abroad", lat: "0.0", lng: "0.0"});
    await db.collection(citiesCollection).insertOne({country : "UA", name : "Струмівка", lat: "50.73950", lng: "25.43009"});
    //
    await db.collection(mappingsCollection).insertMany(JSON.parse(fs.readFileSync('./migrations/mappings-01.json')));
  },

  async down(db, client) {
    //
    await db.collection(mappingsCollection).drop();
    //
    await db.collection(citiesCollection).drop();
  }
};

