//import Vue from 'vue'

async function getConfig(providerName) {
  return import('./apiConfigTypes/' + providerName).then(function (response) {
    return response.default
  })
}

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

  fegetByCategorytchData(category) {
    if (this.#config && this.#config.getByCategory) {
      return this.#config.getByCategory(category)
    } else {
      return []
    }
  }

  getResource(id) {
    if (this.#config && this.#config.getResource) {
      return this.#config.getResource(id)
    } else {
      return []
    }
  }
}

export default {
  apiProvider(provider, url) {
    return getConfig(provider).then(function (config) {
      let a = new DataProvider(provider, url, config)
      a.p
      return new DataProvider(provider, url, config)
    })
  }
}
