import Vue from 'vue'
import { DataProviderConfig } from '../apiProvider'

/**
 * Get menu categories
 * @param {string} baseUrl
 */
async function getMenuSettings(baseUrl) {
  let response = await Vue.$http.get(baseUrl + '/resource/settings')

  return response.data
}

/**
 * Fetch data
 * The Umbraco provider does not fetch all data at once,
 * but by category every time the needed category is selected
 */
async function fetchData() {
  return []
}

/**
 * Get by category
 * @param {number} categoryId
 * @param {string} baseUrl
 */
async function getByCategory(categoryId, baseUrl) {
  if (!categoryId || categoryId === 0) {
    return []
  }

  let response = await Vue.$http.get(baseUrl + '/resource/GetByCategory/' + categoryId)

  return response.data
}

/**
 * Get resource
 * @param {number} id
 * @param {string} baseUrl
 */
async function getResource(id, baseUrl) {
  if (!id || id === 0) {
    return []
  }

  let response = await Vue.$http.get(baseUrl + '/resource/Get/' + id)

  return response.data
}

/**
 * DataProviderConfig
 */
export default new DataProviderConfig(getMenuSettings, fetchData, getByCategory, getResource)
