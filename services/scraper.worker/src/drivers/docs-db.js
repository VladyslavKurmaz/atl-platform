'use strict';

class docsDb {

  constructor(logger) {
    this.logger = logger;
    this.client = null;
    this.dbo = null;
  }

  async connect(url, dbName, user, pass) {
    if (!this.client) {
      this.client = await require('mongodb').MongoClient.connect(url, { useNewUrlParser: true });
    }
    this.dbo = this.client.db(dbName);
  }

  async insert(desc) {
    this.logger.info(desc);
    this.dbo.collection("vacancies").insert(desc);
  }
}


module.exports.builder = () => (logger) => {
  const db = new docsDb(logger);
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