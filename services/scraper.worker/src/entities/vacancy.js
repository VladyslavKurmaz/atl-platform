export default function buildMakeVacancy ({ validator }) {
  return function makeVacancy ({
    url,
    company,
    publishDate,
    title,
    text,
    location,
    salary,
    dateOfListing = Date.now(),
  } = {}) {
    if (!validator.isValidUrl(url)) {
      throw new Error('Vacancy must have a valid url.')
    }
    if (!validator.isValidCompany(company)) {
      throw new Error('Vacancy must have an company.')
    }
    if (!validator.isValidDate(publishDate)) {
      throw new Error('Publish date is incorrect.')
    }
    if (!title || text.title < 1) {
      throw new Error('Title must include at least one character of text.')
    }
    if (!text || text.length < 1) {
      throw new Error('Text must include at least one character of text.')
    }
    if (!validator.isValidLocation(location)) {
      throw new Error('Text must be defined.')
    }
    if (!validator.isValidCurrency(salary)) {
      throw new Error('Salary must be in valid format.')
    }

    return Object.freeze({
      getUr: () => url,
      getCompany: () => company,
      getPublishDae: () => publishDate,
      getTitle: () => title,
      getText: () => text,
      getLocation: () => location,
      getSalary: () => salary,
      getDateOfListing: () => dateOfListing
    })
  }
}