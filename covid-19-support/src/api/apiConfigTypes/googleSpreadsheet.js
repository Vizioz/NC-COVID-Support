import { DataProviderConfig } from '../apiProvider'
import { needCategories } from '../../constants'

/**
 * Use entries to store data internally
 */
let entries = []

/**
 * Get menu categories
 * @param {string} baseUrl
 */
async function getMenuSettings() {
  let categories = needCategories.categories

  return { categories: categories }
}

/**
 * Fetch data
 * Stores the data internally in the entries variable
 * @param {string} baseUrl
 */
async function fetchData(baseUrl) {
  const res = await fetch(baseUrl)
  const json = await res.json()

  entries = json.feed.entry

  return entries
}

/**
 * Get by category
 * @param {number} categoryId
 * @param {string} baseUrl
 */
async function getByCategory(baseUrl) {
  // TODO: filter entries
  console.log(entries)
  console.log(baseUrl)
  return ['1', '2']
}

/**
 * Get resource
 * @param {number} id
 * @param {string} baseUrl
 */
async function getResource(baseUrl) {
  console.log(baseUrl)
  return ['1', '2']
}

/**
 * DataProviderConfig
 */
export default new DataProviderConfig(getMenuSettings, fetchData, getByCategory, getResource)
