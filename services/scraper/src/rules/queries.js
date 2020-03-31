'use strict';

module.exports = {
  spec2loc2company1: {
    title: 'Specialization distribution by location',
    first: 'specialization',
    second: 'location',
    other: 'Other locations',
    data: [
      { "$unwind": "$specializations" },
      { "$unwind": "$locations" },
      { "$unwind": "$company" },
//      { $match: {'locations': 'Dnipro'}},
      { "$group": { "_id": { "specialization": "$specializations", "location": "$locations" }, "cnt": { "$sum": 1.0 } } },
      { "$sort": { "cnt": -1.0 } }
    ]
  },
  spec2loc2company2: {
    title: 'Vacancies per location and company',
    first: 'location',
    second: 'company',
    other: 'Other companies',
    data: [
      { "$unwind": "$specializations" },
      { "$unwind": "$locations" },
      { "$unwind": "$company" },
//      { $match: {'locations': 'Dnipro'}},
      { "$group": { "_id": { "location": "$locations", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
      { "$sort": { "cnt": -1.0 } }
    ]
  },

  seniority2loc2company1: {
    title: 'Specialization distribution by location',
    first: 'seniority',
    second: 'location',
    other: 'Other locations',
    data: [
      { "$unwind": "$seniority" },
      { "$unwind": "$locations" },
      { "$unwind": "$company" },
//      { $match: {'locations': 'Dnipro'}},
      { "$group": { "_id": { "seniority": "$seniority", "location": "$locations" }, "cnt": { "$sum": 1.0 } } },
      { "$sort": { "cnt": -1.0 } }
    ]
  },
  seniority2loc2company2: {
    title: 'Vacancies per location and company',
    first: 'location',
    second: 'company',
    other: 'Other companies',
    data: [
      { "$unwind": "$seniority" },
      { "$unwind": "$locations" },
      { "$unwind": "$company" },
//      { $match: {'locations': 'Dnipro'}},
      { "$group": { "_id": { "location": "$locations", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
      { "$sort": { "cnt": -1.0 } }
    ]
  },

  role2loc2company1: {
    title: 'Specialization distribution by location',
    first: 'role',
    second: 'location',
    other: 'Other locations',
    data: [
      { "$unwind": "$roles" },
      { "$unwind": "$locations" },
      { "$unwind": "$company" },
//      { $match: {'locations': 'Dnipro'}},
      { "$group": { "_id": { "role": "$roles", "location": "$locations" }, "cnt": { "$sum": 1.0 } } },
      { "$sort": { "cnt": -1.0 } }
    ]
  },
  role2loc2company2: {
    title: 'Vacancies per location and company',
    first: 'location',
    second: 'company',
    other: 'Other companies',
    data: [
      { "$unwind": "$roles" },
      { "$unwind": "$locations" },
      { "$unwind": "$company" },
//      { $match: {'locations': 'Dnipro'}},
      { "$group": { "_id": { "location": "$locations", "company": "$company" }, "cnt": { "$sum": 1.0 } } },
      { "$sort": { "cnt": -1.0 } }
    ]
  }
}