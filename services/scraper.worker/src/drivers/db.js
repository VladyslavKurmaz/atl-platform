'use strict';

const baseItem = require('../baseItem');

class db extends baseItem {

  constructor(context) {
    super(context);
    this.client = null;
    this.dbo = null;
    this.companiesCollection = 'contacts';
    this.vacanciesCollection = 'docs.vacancies';
    this.translationsCollection = 'docs.translations';
    this.reportsCollection = 'docs.reports';
  }

  async connect(host, port, user, pass, dbName) {
    if (!this.client) {
      this.client = await require('mongodb').MongoClient.connect(
        `mongodb://${user}:${pass}@${host}:${port}/`,
        { useUnifiedTopology: true, useNewUrlParser: true }
      );
    }
    this.dbo = this.client.db(dbName);
    return true;
  }

  async insertCompany(company) {
    await this.dbo.collection(this.companiesCollection).insertOne(company);
  }

  async findCompanyByHash(hash) {
    const result = await this.dbo.collection(this.companiesCollection).find({ hash: hash });
    const found = await result.toArray();
    if (found.length !== 0) {
      const { _id: id, ...insertedInfo } = found[0];
      return { id, ...insertedInfo }
    }
    return null;
  }

  async insertVacancy(vacancy) {
    await this.dbo.collection(this.vacanciesCollection).insertOne(vacancy);
  }

  async findVacancyByHash(hash) {
    const result = await this.dbo.collection(this.vacanciesCollection).find({ hash: hash });
    const found = await result.toArray();
    if (found.length !== 0) {
      const { _id: id, ...insertedInfo } = found[0];
      return { id, ...insertedInfo }
    }
    return null;
  }

  async findTranslation(word) {
    const result = await this.dbo.collection(this.translationsCollection).find({ from: word });
    const found = await result.toArray();
    if (found.length !== 0) {
      return found[0].to;
    }
    return null;
  }

  async addTranslation(from, to) {
    const result = await this.dbo.collection(this.translationsCollection).insertOne({from: from, to: to});
  }

  async calculateAggregateReport(query) {
    const result = this.dbo.collection(this.vacanciesCollection).aggregate(query);
    const found = await result.toArray();
    return found;
  }
}

module.exports.builder = () => (context) => {
  const scraperDb = new db(context);
  return Object.freeze({
    connect: async (host, port, user, pass, dbName) => await scraperDb.connect(host, port, user, pass, dbName),
    insertCompany: async (company) => await scraperDb.insertCompany(company),
    findCompanyByHash: async (company) => await scraperDb.findCompanyByHash(company),
    insertVacancy: async (vacancy) => await scraperDb.insertVacancy(vacancy),
    findVacancyByHash: async (vacancy) => await scraperDb.findVacancyByHash(vacancy),
    findTranslation: async (word) => await scraperDb.findTranslation(word),
    addTranslation: async (from, to) => await scraperDb.addTranslation(from, to),
    calculateAggregateReport: async (query) => await scraperDb.calculateAggregateReport(query)
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