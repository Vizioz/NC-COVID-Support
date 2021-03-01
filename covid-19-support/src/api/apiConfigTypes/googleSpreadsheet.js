import { DataProviderConfig } from '../apiProvider'
import { needCategories } from '../../constants'

async function getMenuCategories() {
  let categories = needCategories.categories
  return categories
}

async function fetchData(baseUrl) {
  const res = await fetch(baseUrl)
  const entries = await res.json()

  return entries.feed.entry
}

function getByCategory(baseUrl) {
  console.log(baseUrl)
  return ['1', '2']
}

function getResource(baseUrl) {
  console.log(baseUrl)
  return ['1', '2']
}

export default new DataProviderConfig(getMenuCategories, fetchData, getByCategory, getResource)
