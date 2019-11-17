'use strict';

const baseItem = require('./../baseItem');

class docsDb extends baseItem {

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
  }

  async insert(desc) {
    this.context.logger.info(desc.url);
    this.dbo.collection("vacancies").insertOne(desc);
  }
}

module.exports.builder = () => (context) => {
  const db = new docsDb(context);
  return Object.freeze({
    connect: async (url, dbName, user, pass) => await db.connect(url, dbName, user, pass),
    insert: async (desc) => await db.insert(desc)
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