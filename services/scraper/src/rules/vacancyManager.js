'use strict';

const gt = require('google-translate')(process.env.COMPONENT_PARAM_TRANSLATE_API_KEY, {});
const baseRule = require('./baseRule');


const rolesKeywords = {
  'Developer': 'Developer',
  'Engineer': 'Developer',
  'Lead': 'Developer',
  'QA': 'QA',
  'DevOps': 'DevOps',
  'Admin': 'Administrator',
  'Administrator': 'Administrator',
  'Project Manager': 'Project Manager',
  'Delivery Manager': 'Delivery Manager',
  'Automation': 'QA'
};

const seniorityKeywords = {
  'Intern': 'Intern',
  'Junior': 'Junior',
  'Middle': 'Middle',
  'Senior': 'Senior',
  'Fullstack': 'Senior',
  'Full-stack': 'Senior',
  'Lead': 'Lead',
  'Architect': 'Architect',
  'CTO': 'CTO',
  'Engineer': 'Middle',
  'Developer': 'Senior',
  'Programmer': 'Middle'
};

const specializatonKeywords = {
  'Java': 'Java',
  'Python': 'Python',
  '\\.NET': '.NET',
  'Ruby': 'Ruby',
  'RoR': 'Ruby',
  'PHP': 'PHP',
  'Go': 'Go',
  'Golang': 'Go',
  'JavaScript': 'JavaScript',
  'JS': 'JavaScript',
  'NodeJS': 'JavaScript',
  'JS': 'JavaScript',
  'iOS': 'iOS/MacOS',
  'MacOS': 'iOS/MacOS',
  'Swift': 'iOS/MacOS',
  'C\\+\\+': 'C++',
  'Android': 'Android',
  'Angular': 'Angular',
  'AngularJS': 'Angular',
  'Rust': 'Rust',
  'Scala': 'Scala',
  'React': 'React',
  'AWS': 'Clouds',
  'Azure': 'Clouds',
  'GCP': 'Clouds',
  'Admin': 'Clouds',
  'System': 'Clouds',
  'DevOps': 'Clouds',
  'SRE': 'Clouds',
  'Infrastructure': 'Clouds',
  'Hadoop': 'Clouds',
  'Architect': 'Clouds',
  'IoT': 'IoT',
  'Support': 'Support',
  'Data': 'Data Engineer',
  'Learning': 'Machine Learning',
  'ML': 'Machine Learning',
  'Vision': 'Computer Vision',
  'QA': 'QA',
  'Test': 'QA',
  'Automation': 'QA',
//  'Engine': 'Computer graphics',
//  'Unity': 'Computer graphics',
  'Manager': 'Management',
  'Security': 'Security',
  'SecOps': 'Security',
  'Embedded': 'Embedded',
  'Linux': 'Embedded',
  'Kernel': 'Embedded',
  'Oracle': 'DBA',
  'SQL': 'DBA',
  'Analyst': 'BI'
};


class vacancyManager extends baseRule {
  constructor(context) {
    super(context);
    this.cache = [];
  }

  async add(companyDesc, vacancyDesc) {
    let result = [];
    // process vacancy
    // extract roles, seniority & specializations
    const roles = this.extractQuirks(
      vacancyDesc.title,
      vacancyDesc.text,
      rolesKeywords,
      'Developer'
    );
    const seniority = this.extractQuirks(
      vacancyDesc.title,
      vacancyDesc.text,
      seniorityKeywords,
      'Middle'
    );
    const specializations = this.extractQuirks(
      vacancyDesc.title,
      vacancyDesc.text,
      specializatonKeywords,
      'Other'
    );
    //
    const desc = {...vacancyDesc, roles: roles, seniority: seniority, specializations: specializations};
    const vacancy = this.context.entities.createVacancy(this.context.clone('logger', 'utils'), desc);
    // translate location and apply mapping if needed
    let locations = await this.getMappings(await this.translate(vacancy.getLocations()), false);
    // confirm that location exists
    const {failed, missedLocations} = await this.validateLocations(locations);
    if (failed) {
      result.push({key: missedLocations, details: vacancy.getUrl()});
    }
    // check mapping for company
    const companyName = await this.getMappings([companyDesc.key], true);
    if (!companyName.length) {
      result.push({key: companyDesc.key, details: companyDesc.url, from:companyDesc.key, to: companyDesc.name});
    }

    if (result.length === 0) { // all mappings are fine
      const vHash = this.context.utils.md5(vacancy.getUrl());
      if (!await this.context.db.findVacancyByHash(vHash)) {
        await this.context.db.insertVacancy({
          id: this.context.utils.getUuid(),
          hash: vHash,
          url: vacancy.getUrl(),
          company: companyName[0],
          date: new Date(vacancy.getDate()),
          title: vacancy.getTitle(),
          text: vacancy.getText(),
          locations: locations,
          salary: vacancy.getSalary(),
          roles: vacancy.getRoles(),
          seniority: vacancy.getSeniority(),
          specializations: vacancy.getSpecializations()
        });
      }
    }
    return result;
  }

  extractQuirks(title, text, keyWords, defValue) {
    let  result = [];
    Object.keys(keyWords).forEach( k => {
      if (!!title.match(new RegExp(k, 'i'))) {
        result.push(keyWords[k]);
      }
    });
    result = [... new Set(result)];
    if (result.length === 0 ){
      return [defValue];
    }
    return result;
  }

  async doTranslate(word) {
    return new Promise( (resolve, reject) => {
      gt.translate(word, 'en', function (err, translation) {
        if (err) {
          reject(err);
        }
        else {
          resolve(translation.translatedText);
        }
      });
    });
  }

  async translate(words) {
    let r = []
    for (const w of words) {
      let t = null;
      if (this.cache[w]) {
        t = this.cache[w];
      } else {
        t = await this.context.db.findTranslation(w);
        if (!t) {
          // request translation API
          t = await this.doTranslate(w);
          if (t) {
            await this.context.db.addTranslation(w, t);
          }
        }
        // cache translation
        if (t) {
          this.cache[w] = t;
        }
      }
      if (t) {
        r.push(t);
      }
    }
    return r;
  }

  async getMappings(mappings, strict) {
    let result = [];
    for (const m of mappings) {
      const nm = await this.context.db.getMapping(m);
      if (nm || !strict) {
        result.push(nm?nm:m);
      }
    }
    return result;
  }

  async validateLocations(locations) {
    let result = [];
    for (const l of locations) {
      if (!await this.context.db.validateLocation(l) ) {
        result.push(l);
      }
    }
    return {failed : (result.length !== 0), missedLocations: result};
  }

}

module.exports.builder = () => (context) => {
  const manager = new vacancyManager(context);
  return Object.freeze({
    add: async (companyDesc, vacancyDesc) => await manager.add(companyDesc, vacancyDesc)
  });
}