'use strict';

class vacanciesDb {

  constructor(logger) {
    this.logger = logger;
  }

  async insert(desc) {
    this.logger.info(desc);
  }
}


module.exports.create = (logger) => {
  const db = new vacanciesDb(logger);
  return Object.freeze({
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