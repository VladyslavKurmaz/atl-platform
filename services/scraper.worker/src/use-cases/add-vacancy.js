import makeVacancy from '../entities'

export default function makeAddVacancy ({ db }) {
  return async function addVacancy(vacancyInfo) {
    const vacancy = makeVacancy(vacancyInfo)
    const exists = await db.findByHash({ hash: comment.getHash() })
    if (exists) {
      return exists;
    }
    return commentsDb.insert(vacancy);
  }
}
