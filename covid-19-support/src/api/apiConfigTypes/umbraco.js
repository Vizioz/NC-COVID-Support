import Vue from 'vue'
import { DataProviderConfig } from '../apiProvider'

async function getMenuCategories(baseUrl) {
  let response = await Vue.$http.get(baseUrl + '/resource/settings')
  let list = []

  response.data.categories.map(function (value) {
    value.code = value.id
    list.push(value)
  })

  return list
}

async function fetchData() {
  // baseUrl = 'https://spreadsheets.google.com/feeds/list/1NNo23idWdFofp5LbBS_3S6EQfzgbe1sVgr2GRAjucA0/1/public/values?alt=json'
  // const res = await fetch(baseUrl)
  // const entries = await res.json()

  // return entries.feed.entry

  return []
}

async function getByCategory(baseUrl) {
  console.log(baseUrl)
  return ['1', '2']
}

async function getResource(baseUrl) {
  console.log(baseUrl)
  return ['1', '2']
}

export default new DataProviderConfig(getMenuCategories, fetchData, getByCategory, getResource)
