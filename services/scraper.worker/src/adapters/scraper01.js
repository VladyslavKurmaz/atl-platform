'use strict';

const url = require('url');
const moment = require('moment');

const { baseScraper } = require('./baseScraper');

class scraper01 extends baseScraper {

  constructor(context, config) {
    super(context, config, 'Scraper01', 'https://jobs.dou.ua');
  }

  getSearchUrl(kw) {
    return `${this.baseUrl}/vacancies/?category=${kw}`
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

  parseVacancy($) {
    const vnode = $('.b-vacancy');
    const companyUrl = $(vnode).find('.b-compinfo > a').attr().href;
    const dateStr = $(vnode).find('.date').text();
    const m = moment(dateStr, 'DD MMMM YYYY', 'ru');
    return {
      company: {
        id: url.parse(companyUrl).pathname.split('/')[2],
        url: companyUrl,
        name: $(vnode).find('.b-compinfo > .info > .l-n > a').first().text()
      },
      date: m.format('YYYY-MM-DD'),
      location: $(vnode).find('.l-vacancy .place').text().trim(),
      salary: $(vnode).find('.l-vacancy .salary').text().trim(),
      title: $(vnode).find('.g-h2').text(),
      text: $(vnode).find('.l-vacancy .vacancy-section').text()
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

