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

  async calculateWeeklyReport() {
    const s = moment().startOf('isoWeek');
    const e = moment().endOf('isoWeek');
    const threshold = 3
    await this.calculate( s, e, e.format('YYYY-MM-DD'),
      [
        { id: "count2location", threshold: threshold },
        { id: "count2citycompany", threshold: threshold },
        { id: "specBycompany", threshold: threshold },
        { id: "specBylocation", threshold: threshold },
        { id: "seniorityBycompany", threshold: threshold },
        { id: "seniorityBylocation", threshold: threshold },
        { id: "roleBycompany", threshold: threshold },
        { id: "roleBylocation", threshold: threshold }
      ]
    );
  }

  async calculateMonthlyReport() {
    const m = moment("2020-01-15");
    const s = moment(m).startOf('month');
    const e = moment(m).endOf('month');
    const threshold = 20;
    await this.calculate(s, e, e.format('YYYY MMMM'),
      [
        { id: "count2location", threshold: threshold },
        { id: "count2company", threshold: threshold },
        { id: "count2specialization", threshold: 10 },
        { id: "count2seniority", threshold: 0 }
      ]
    );
  }
  /*
  count2location
  count2company
  count2specialization
  count2seniority
  count2citycompany
  specBycompany
  specBylocation
  seniorityBycompany
  seniorityBylocation
  roleBycompany
  roleBylocation
  */
  async calculate(startDate, endDate, title, reports) {
    const start = startDate;
    const end = endDate;
    // Calculate report
    const report = {
      title: title,
      date: moment().format(),
      start: start.format(),
      end: end.format(),
      graphs: [
      ]
    };
    this.context.logger.info('Calculating report at ' + moment().format() + ' for [' + start.format() + ' - ' + end.format() + ']');
    //
    const match = {$match: {'date': { '$gte' : new Date(start.format()), '$lte' : new Date(end.format())}}};
    //
    for (const r of reports) {
      if (r.id === "count2location") {
        const positions = [];
        let totalVacancies = 0;
        (await this.context.db.calculateAggregateReport(
          [
            match,
            {$unwind: '$locations'}, {$group: { _id: '$locations', cnt: {$sum: 1}}},
            {$sort: { cnt: -1 } }
          ]
        )).
        map( e => {
          for( let c = 0; c < cities.length; c++ ) {
            if (e._id === cities[c].name) {
              totalVacancies += e.cnt;
              if (e.cnt > 2) {
                for (let cnt = 0; cnt < e.cnt; cnt++) {
                  positions.push([cities[c].lat, cities[c].lng]);
                }
              }
              break;
            }
          }
        })
        report.graphs.push(
          {
            type: 'map',
            title: `Distribution of vacancies (${totalVacancies})`,
            data: positions
          }
        );
      }
      if (r.id === "count2company") {
        report.graphs.push(
          {
            type: 'pie',
            title: 'Vacancies per company',
            data: await this.getBarReport(
              [
                match,
                { "$group": { "_id": { "company": "$company" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'company',
              'Company',
              r.threshold,
              10000,
              'Other companies',
              true,
              true
            )
          }
        );
      }
      if (r.id === "count2specialization") {
        report.graphs.push(
          {
            type: 'pie',
            title: 'Specializations',
            data: await this.getBarReport(
              [
                match,
                { "$unwind": "$specializations" },
                { "$group": { "_id": { "specialization": "$specializations" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'specialization',
              'Specialization',
              r.threshold,
              280,
              'Other',
              false,
              false
            )
          }
        );
      }
      if (r.id === "count2seniority") {
        report.graphs.push(
          {
            type: 'pie',
            title: 'Seniority',
            data: await this.getBarReport(
              [
                match,
                { "$unwind": "$seniority" },
                { "$group": { "_id": { "seniority": "$seniority" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'seniority',
              'Seniority',
              r.threshold,
              10000,
              'Other',
              false,
              false
            )
          }
        );
      }
      if (r.id === "count2citycompany") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Vacancies per city and company',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$locations" },
                { "$group": { "_id": { "location": "$locations", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'location',
              'company',
              r.threshold,
              'Other companies'
            )
          }
        );
      }
      if (r.id === "specBycompany") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Demand for specialization by company',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$specializations" },
                { "$group": { "_id": { "specialization": "$specializations", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'specialization',
              'company',
              r.threshold,
              'Other companies'
            )
          }
        );
      }
      if (r.id === "specBylocation") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Specialization distribution by location',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$specializations" },
                { "$unwind": "$locations" },
                { "$group": { "_id": { "specialization": "$specializations", "location": "$locations" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'specialization',
              'location',
              r.threshold,
              'Other locations'
            )
          }
        );
      }
      if (r.id === "seniorityBycompany") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Demand for seniority by company',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$seniority" },
                { "$group": { "_id": { "seniority": "$seniority", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'seniority',
              'company',
              r.threshold,
              'Other companies'
            )
          }
        );
      }
      if (r.id === "seniorityBylocation") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Seniority distribution by location',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$seniority" },
                { "$unwind": "$locations" },
                { "$group": { "_id": { "seniority": "$seniority", "location": "$locations" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'seniority',
              'location',
              r.threshold,
              'Other locations'
            )
          }
        );
      }
      if (r.id === "roleBycompany") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Demand for role by company',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$roles" },
                { "$group": { "_id": { "role": "$roles", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'role',
              'company',
              r.threshold,
              'Other companies'
            )
          }
        );
      }
      if (r.id === "roleBylocation") {
        report.graphs.push(
          {
            type: 'sankey',
            title: 'Role distribution by location',
            data: await this.getSankeyReport(
              [
                match,
                { "$unwind": "$roles" },
                { "$unwind": "$locations" },
                { "$group": { "_id": { "role": "$roles", "location": "$locations" }, "cnt": { "$sum": 1.0 } } },
                { "$sort": { "cnt": -1.0 } }
              ],
              'role',
              'location',
              r.threshold,
              'Other locations'
            )
          }
        );
      }
    }
    //
    fs.writeFileSync('report.json', JSON.stringify(report), 'utf8');
    this.context.logger.info('Calculating report is done');
  }

  async getSankeyReport(query, from, to, threshold, defValueTo, defValueFrom = null) {
    const data = [];
    const rawData = await this.context.db.calculateAggregateReport(query);
    for(let i = 0; i < rawData.length; i++) {
      if (rawData[i].cnt >= threshold) {
        data.push([rawData[i]._id[from], rawData[i]._id[to], rawData[i].cnt]);
      } else {
        if (defValueTo) {
          data.push([defValueFrom?defValueFrom:rawData[i]._id[from], defValueTo, rawData[i].cnt]);
        }
      }

    }
    // normilize data
    const normData = [];
    for(let i = 0; i < data.length; i++) {
      const item = normData.find( e => (data[i][0] === e[0] && data[i][1] === e[1]) );
      if (item) {
        item[2] += data[i][2];
      } else {
        normData.push(data[i]);
      }
    }
    return [['From', 'To', 'Weight']].concat(normData);
  }

  async getBarReport(query, field, title, thresholdMin, thresholdMax, defTitle, showCount, showOther) {
    const data = [];
    const rawData = await this.context.db.calculateAggregateReport(query);
    let otherCnt = 0;
    for(let i = 0; i < rawData.length; i++) {
      if (thresholdMin <= rawData[i].cnt && rawData[i].cnt <= thresholdMax) {
        data.push([rawData[i]._id[field] + (showCount?' (' + rawData[i].cnt + ')':''), rawData[i].cnt]);
      } else {
        otherCnt = otherCnt + rawData[i].cnt;
      }
    }
    if (showOther) {
      return [[title, 'Count']].concat(data).concat([[defTitle, otherCnt]]);
    } else {
      return [[title, 'Count']].concat(data);
    }
  }
}

module.exports.builder = () => (context) => {
  const manager = new reportManager(context);
  return Object.freeze({
    calculateWeeklyReport: async () => await manager.calculateWeeklyReport(),
    calculateMonthlyReport: async () => await manager.calculateMonthlyReport()
  });
}