'use strict';

const baseItem = require('../baseItem');

class db extends baseItem {

  constructor(context) {
    super(context);
    this.client = null;
    this.dbo = null;
  }

  async connect(url, dbName, user, pass) {
    if (!this.client) {
      this.client = await require('mongodb').MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    }
    this.dbo = this.client.db(dbName);
    return true;
  }

  async insert(desc) {
    this.dbo.collection("docs").insertOne(desc);
  }

  async findByHash(hash) {
    const result = await this.dbo.collection('docs').find({ hash: hash });
    const found = await result.toArray();
    if (found.length !== 0) {
      const { _id: id, ...insertedInfo } = found[0];
      return { id, ...insertedInfo }
    }
    return null;
  }
}

module.exports.builder = () => (context) => {
  const scraperDb = new db(context);
  return Object.freeze({
    connect: async (url, dbName, user, pass) => await scraperDb.connect(url, dbName, user, pass),
    insert: async (desc) => await scraperDb.insert(desc),
    findByHash: async (hash) => await scraperDb.findByHash(hash)
  });
}

/*
export default function makeVacanciesDb ({ makeDb }) {
  return Object.freeze({
    findByHash
  })
  async function findByHash (hash) {
    //
    const db = await makeDb()
    const result = await db.collection('comments').find({ hash: comment.hash })
    const found = await result.toArray()
    if (found.length === 0) {
      return null
    }
    const { _id: id, ...insertedInfo } = found[0]
    return { id, ...insertedInfo }
    //
    return {};
  }
}
*/