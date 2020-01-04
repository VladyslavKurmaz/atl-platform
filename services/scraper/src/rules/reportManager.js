'use strict';

const moment = require('moment');
const baseRule = require('./baseRule');

/*
db.docs.vacancies.aggregate([{$unwind: '$location'}, {$group: { _id: '$location', tags: {$sum: 1}} }, {$sort: { tags: -1 } }])

db.test.aggregate([{$unwind: '$location'}, {$group: { _id: '$location', tags: {$sum: 1}} }, {$sort: { tags: -1 } }])

{ 'date' : { '$gte' : ISODate('2019-12-06'), '$lte' : ISODate('2019-12-06') } }
{ 'date' : { '$gte' : ISODate('2019-12-09T00:00:00+02:00'), '$lte' : ISODate('2019-12-15T23:59:59+02:00') } }

db.getCollection("docs.vacancies").aggregate(
    [
        { 
            "$match" : {
                "date" : {
                    "$gte" : ISODate("2019-12-06T00:00:00.000+0000"), 
                    "$lte" : ISODate("2019-12-06T00:00:00.000+0000")
                }
            }
        }, 
        { 
            "$unwind" : "$location"
        }, 
        { 
            "$group" : {
                "_id" : "$location", 
                "tags" : {
                    "$sum" : 1.0
                }
            }
        }, 
        { 
            "$sort" : {
                "tags" : -1.0
            }
        }
    ], 
    { 
        "allowDiskUse" : false
    }
);

db.getCollection("docs.vacancies").aggregate([{$group: { _id: '$companyKey', tags: {$sum: 1}} }, {$sort: { tags: -1 } }])

*/
class reportManager extends baseRule {
  constructor(context) {
    super(context);
    this.cache = [];
  }

  async calculate(startDate, endDate) {
    let start = startDate;
    let end = endDate;
    const today = moment();
    if (!(start && end)) {
      start = today.startOf('isoWeek');
      end = today.endOf('isoWeek');
    }
    // Calculate report
    this.context.logger.info('Calculating report [' + start.format() + ' - ' + end.format() + ']');
    console.log(await this.context.db.calculateAggregateReport(
      [{$unwind: '$locations'}, {$group: { _id: '$locations', tags: {$sum: 1}} }, {$sort: { tags: -1 } }]
    ));

  }
}

module.exports.builder = () => (context) => {
  const manager = new reportManager(context);
  return Object.freeze({
    calculate: async (startDate, endDate) => await manager.calculate(startDate, endDate)
  });
}