'use strict';

class vacanciesDb {

  constructor() {
  }

  async hi() {
  }
}


module.exports.create = () => {
  const db = new vacanciesDb();
  return Object.freeze({
    hi: async () => db.hi()
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