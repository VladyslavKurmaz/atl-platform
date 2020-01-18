'use strict';

const url = require('url');
const moment = require('moment');

const { baseScraper } = require('./baseScraper');

class scraper01 extends baseScraper {

  constructor(context, config) {
    super(context, config, 'Scraper01', 'https://jobs.dou.ua');
  }

  getSearchUrl(kw) {
    return `${this.baseUrl}/vacancies/?category=` + encodeURIComponent(kw);
  }

  parseSearch($) {
    const items = [];
    $(".l-vacancy").each(function (i, e) {
      const title = $(this).find('.title > a').text();
      const href = $(this).find('.title > a').attr().href;
      items.push(href);
    });
    return items.map(e => this.context.utils.cleanupUrl(e));
  }

  parseVacancy($, vacancyUrl) {
    const vnode = $('.b-vacancy');
    const companyUrl = $(vnode).find('.b-compinfo > .info > .l-n > a').attr().href;
    const dateStr = $(vnode).find('.date').text();
    const m = moment(dateStr, 'DD MMMM YYYY', 'ru');
    const location = ($(vnode).find('.l-vacancy .place').text().trim());
    const locations = location.split(',').map(e => {
      const s = e.trim();
      const pos = s.indexOf('(');
      if (pos !== -1) {
        return s.substring(0, pos).trim();
      }
      return s;
    });
    return {
      companyUrl: companyUrl,
      vacancy: {
        url: vacancyUrl,
        date: m.format('YYYY-MM-DD'),
        locations: locations,
        salary: $(vnode).find('.l-vacancy .salary').text().trim(),
        title: $(vnode).find('.g-h2').text(),
        text: $(vnode).find('.l-vacancy .vacancy-section').text()
      }
    }
  }

  parseCompany($, companyUrl) {
    const vnode = $('.company-info');
    const name = $(vnode).find('h1').text().trim();
    return {
      url: companyUrl,
      key: url.parse(companyUrl).pathname.split('/')[2],
      name: name,
      domain: $(vnode).find('.site').text().trim()
    }
  }

}

module.exports.builder = () => (context, config) => {
  return (new scraper01(context, config)).getInterface();
}


/*/
request('https://jobs.dou.ua/vacancies/feeds/?category=java', (err, resp, body) => {
  if (err) {
    console.log('error:', err);
  } else {
    console.log('statusCode:', resp && resp.statusCode);
    parseXml(body, (err, res) => {
      const vacancy = res.rss.channel[0].item[2];
      const guid = url.parse(vacancy.guid[0]);
      guid.search= '';
      const desc = {
        title: vacancy.title[0],
        description: vacancy.description[0],
        source: url.format(guid),
        company: guid.pathname.split('/')[2],
        date: res.rss.channel[0].item[0].pubDate[0],
        spec: 'developer',
        base: 'C++',
        location: [],
        seniority: 'intern'
      };
      console.log(desc);
    });
  }
});
/*/
/*/
/*/

