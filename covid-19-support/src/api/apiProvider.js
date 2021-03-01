/**
 * Get Config
 * Imports the DataProviderConfig file from the available types by name
 * and returns the new object
 * @param {string} providerName
 */
async function getConfig(providerName) {
  return import('./apiConfigTypes/' + providerName).then(function (response) {
    return response.default
  })
}

/**
 * The DataProviderConfig class
 * It contains the provider behaviour methods
 */
export class DataProviderConfig {
  getMenuCategories
  fetchData
  getByCategory
  getResource

  constructor(getMenuCategories, fetchData, getByCategory, getResource) {
    this.getMenuCategories = getMenuCategories
    this.fetchData = fetchData
    this.getByCategory = getByCategory
    this.getResource = getResource
  }
}

/**
 * The DataProvider class.
 */
export class DataProvider {
  #providerName
  #baseUrl
  #config

  constructor(provider, url, config) {
    this.#providerName = provider
    this.#baseUrl = url
    this.#config = config
    this.#config.baseUrl = url
  }

  getProviderName() {
    return this.#providerName
  }

  getBaseUrl() {
    return this.#baseUrl
  }

  getMenuCategories() {
    if (this.#config && this.#config.getMenuCategories) {
      return this.#config.getMenuCategories(this.#baseUrl)
    } else {
      return []
    }
  }

  fetchData() {
    if (this.#config && this.#config.fetchData) {
      return this.#config.fetchData(this.#baseUrl)
    } else {
      return []
    }
  }

  fetchByCategory(category) {
    if (this.#config && this.#config.getByCategory) {
      return this.#config.getByCategory(category, this.#baseUrl)
    } else {
      return []
    }
  }

  getResource(id) {
    if (this.#config && this.#config.getResource) {
      return this.#config.getResource(id, this.#baseUrl)
    } else {
      return []
    }
  }
}

/**
 * Exports the default method to build and get the api provider
 */
export default {
  apiProvider(provider, url) {
    return getConfig(provider).then(function (config) {
      return new DataProvider(provider, url, config)
    })
  }
}
