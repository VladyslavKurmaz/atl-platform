'use strict';

const fs = require('fs');
const moment = require('moment');
const baseRule = require('./baseRule');
const cities = require('cities.json');

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
    const today = moment('2019-01-15');
    console.log(today.format());
    if (!(start && end)) {
      start = moment().startOf('isoWeek');
      end = moment().endOf('isoWeek');
    }
    // Calculate report
    const report = {
      title: end.format('YYYY-MM-DD'),
      date: moment().format(),
      start: start.format(),
      end: end.format(),
      graphs: [
      ]
    };
    this.context.logger.info('Calculating report at ' + moment().format() + ' for [' + start.format() + ' - ' + end.format() + ']');
    //
    const match = {$match: {'date': { '$gte' : new Date(start.format()), '$lte' : new Date(end.format())}}};
    const positions = [];
    (await this.context.db.calculateAggregateReport(
      [
        match,
        {$unwind: '$locations'}, {$group: { _id: '$locations', cnt: {$sum: 1}}},
        {$sort: { cnt: -1 } }
      ]
    )).
    filter(e => e.cnt > 1).
    map( e => {
      for( let c = 0; c < cities.length; c++ ) {
        if (e._id === cities[c].name) {
          for (let cnt = 0; cnt < e.cnt; cnt++) {
            positions.push([cities[c].lat, cities[c].lng]);
          }
          break;
        }
      }
    })

    // console.log((await this.context.db.calculateAggregateReport(
    //   [{'$group' : {'_id' : '$company', 'cnt' : {'$sum' : 1.0}}}, {'$sort' : {'cnt' : -1.0}}]
    //   )).filter(e => e.cnt > 0));

    const reporThreshold = 4;
    report.graphs.push(
      {
        type: 'map',
        title: 'Number of vacancies per city',
        data: positions
      }
    );
    report.graphs.push(...[
        {
          type: 'sankey',
          title: 'Vacancy per city per company',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$locations"}, 
              {"$group" : {"_id" : {"location" : "$locations", "company" : "$company"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'location',
            'company',
            'Other companies',
            reporThreshold
          )
        },
        {
          type: 'sankey',
          title: 'Demand for specialization by company',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$specializations"}, 
              {"$group" : {"_id" : {"specialization" : "$specializations", "company" : "$company"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'specialization',
            'company',
            'Other companies',
            2
          )
        },
        {
          type: 'sankey',
          title: 'Specialization distribution by location',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$specializations"}, 
              {"$unwind" : "$locations"}, 
              {"$group" : {"_id" : {"specialization" : "$specializations", "location" : "$locations"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'specialization',
            'location',
            'Other locations',
            2
          )       
        },
        {
          type: 'sankey',
          title: 'Demand for seniority by company',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$seniority"}, 
              {"$group" : {"_id" : {"seniority" : "$seniority", "company" : "$company"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'seniority',
            'company',
            'Other companies',
            reporThreshold
          )
        },
        {
          type: 'sankey',
          title: 'Seniority distribution by location',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$seniority"}, 
              {"$unwind" : "$locations"}, 
              {"$group" : {"_id" : {"seniority" : "$seniority", "location" : "$locations"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'seniority',
            'location',
            'Other locations',
            reporThreshold
          )
        },
        {
          type: 'sankey',
          title: 'Demand for role by company',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$roles"}, 
              {"$group" : {"_id" : {"role" : "$roles", "company" : "$company"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'role',
            'company',
            'Other companies',
            reporThreshold
          )
        },
        {
          type: 'sankey',
          title: 'Role distribution by location',
          data: await this.getSankeyReport(
            [
              match,
              {"$unwind" : "$roles"}, 
              {"$unwind" : "$locations"}, 
              {"$group" : {"_id" : {"role" : "$roles", "location" : "$locations"}, "cnt" : {"$sum" : 1.0}}}, 
              {"$sort" : {"cnt" : -1.0}}
            ],
            'role',
            'location',
            'Other locations',
            reporThreshold
          )
        }
      ]
      
      );
    //
    fs.writeFileSync('report.json', JSON.stringify(report), 'utf8');
    this.context.logger.info('Calculating report is done');
  }

  async getSankeyReport(query, from, to, defValue, threshold) {
    const data = [
      ['From', 'To', 'Weight']
    ];
    const rawData = await this.context.db.calculateAggregateReport(query);
    for( let i = 0; i < rawData.length; i++) {
      if (rawData[i].cnt >= threshold) {
        data.push([rawData[i]._id[from], rawData[i]._id[to], rawData[i].cnt]);
      } else {
        if (defValue) {
          data.push([rawData[i]._id[from], defValue, rawData[i].cnt]);
        }
      }

    }
    return data;
  }
}

module.exports.builder = () => (context) => {
  const manager = new reportManager(context);
  return Object.freeze({
    calculate: async (startDate, endDate) => await manager.calculate(startDate, endDate)
  });
}