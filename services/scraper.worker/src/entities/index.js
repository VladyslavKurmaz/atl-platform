import buildMakeVacancy from './vacancy'

const makeVacancy = buildMakeVacancy({
  isValidUrl: (url) => {
    return true;
  }
  isValidCompany: (company) => {
    return true;
  }
  isValidDate: (publishDate) => {
    return true;
  }
  isValidLocation: (location) => {
    return true;
  }
  isValidCurrency: (salary) => {
    return true;
  }
 });

export default makeVacancy;
