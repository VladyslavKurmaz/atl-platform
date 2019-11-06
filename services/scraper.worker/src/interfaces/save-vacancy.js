export default function makeSaveVacancy({ httpParser, addVacancy }) {
  return async function saveVacancy(htmlData) {
    try {
      /*
      const { source = {}, ...commentInfo } = httpRequest.body
      source.ip = httpRequest.ip
      source.browser = httpRequest.headers['User-Agent']
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const added = await addVacancy({
        ...vacancyInfo
      })
      */
      return true;

    } catch (e) {
      console.log(e)
      return false;
    }
  }
}