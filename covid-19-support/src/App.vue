<template>
  <div class="home">
    <app-header :language="language.name" @language-selected="changeLanguage" :socialMedia="socialMediaico">
      <theme-header></theme-header>
    </app-header>
    <mobile-search-filters :need="need" :neededCategories="neededCategories" :warning="warningMobile" @need-selected="needSelected" />
    <!-- <mobile-map-list-toggle
      :is-filter-open="isFilterOpen"
      :is-resource-selected="locationData.currentBusiness != null && showList !== true"
      @toggle="isFilterOpen = !isFilterOpen"
    /> -->
    <about-us-modal />
    <div class="d-flex" id="wrapper" :class="{ toggled: isFilterOpen }" v-if="!!entries">
      <sidebar
        :isFilterOpen="isFilterOpen"
        :need="need"
        :day="day"
        :filteredMarkers="filteredMarkers"
        :highlightFilteredMarkers="highlightFilteredMarkers"
        :location="locationData"
        :show-list="showList"
        :isListOnly="isListOnly"
        :warning="warning"
        :neededCategories="neededCategories"
        @location-selected="locationSelected"
        @toggle="isFilterOpen = !isFilterOpen"
        @need-selected="needSelected"
        @update-show-list="updateShowList"
        @close-details="closeDetails"
      />

      <div id="page-content-wrapper">
        <highlights
          :need="need"
          :class="{ toggled: isFilterOpen }"
          :filteredMarkers="highlightFilteredMarkers"
          :highlightFilters="highlightFilters"
          :filterOptions="filterOptions"
          @box-selected="boxSelected"
        />

        <resource-map
          :filteredMarkers="filteredMarkers"
          :class="{ noselection: need == 0 || !filterOptions || !filterOptions.length }"
          :location="locationData"
          :attribution="attribution"
          :geoJson="selectedGeoJson"
          :regionFilters="regionFilters"
          @location-selected="locationSelected"
          @location-unselected="locationUnselected"
          @bounds="boundsUpdated"
          @center="centerUpdated"
          @region-selected="regionSelected"
          :mapUrl="mapUrl"
          :centroid="centroid"
          :countyStyle="countyStyle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import AppHeader from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Highlights from './components/Highlights.vue'
import ResourceMap from './components/ResourceMap.vue'
import AboutUsModal from './components/AboutUs.vue'
import MobileSearchFilters from './components/MobileSearchFilters'
// import MobileMapListToggle from './components/MobileMapListToggle'
import { latLng } from 'leaflet'
import { haversineDistance, sortByDistance } from './utilities'

//import { dayFilters, booleanFilters, dayAny } from './constants'
import { dayAny } from './constants'

import { theme } from 'theme.config'
import ThemeHeader from 'theme.header'

import ProviderFactory from './api/apiProvider'

function extend(obj, src) {
  for (var key in src) {
    obj.push(src[key])
  }
  return obj
}

function addOrRemove(array, item) {
  const exists = array.includes(item)

  if (exists) {
    return array.filter((c) => {
      return c !== item
    })
  } else {
    const result = array
    result.push(item)
    return result
  }
}

export default {
  name: 'app',
  props: {
    msg: String
  },
  watch: {
    currentPage: 'fetchData'
  },
  created() {
    let t = this
    ProviderFactory.apiProvider(theme.data.provider, theme.data.url).then(function (r) {
      Vue.prototype.$api = r
      t.fetchCategories()
      t.fetchData()
      t.getRegionsArea()
    })
  },
  components: {
    MobileSearchFilters,
    // MobileMapListToggle,
    AboutUsModal,
    AppHeader,
    Highlights,
    ResourceMap,
    Sidebar,
    ThemeHeader
  },
  data() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const mobileMediaQuery = window.matchMedia('(min-width: 768px)')
    return {
      provider: null,
      entries: null,
      need: 0,
      day: dayAny,
      isFilterOpen: true,
      language: { name: 'English', iso: 'en' },
      locationData: { locValue: null, locId: null, currentBusiness: null, isSetByMap: false },
      showList: false,
      isListOnly: false,
      showCounties: false,
      highlightFilters: [],
      regionFilters: [],
      bounds: null,
      centroid: {
        lat: theme.settings.initialMapCenter.lat,
        lng: theme.settings.initialMapCenter.lng,
        zoom: theme.settings.initialMapZoom
      },
      mobileMediaQuery: mobileMediaQuery,
      darkModeMediaQuery: darkModeMediaQuery,
      darkMode: darkModeMediaQuery.matches,
      mapUrl: '',
      attribution: null,
      socialMediaico: theme.socialMedia,
      neededCategories: null,
      markers: [],
      filterOptions: [],
      warning: theme.warning,
      warningMobile: theme.warning,
      geoJson: null,
      countyStyle: theme.maps.normal.countyStyle
    }
  },
  mounted() {
    this.setDarkMode(this.darkMode)
    this.darkModeMediaQuery.addListener((e) => {
      this.darkMode = e.matches
      this.setDarkMode(this.darkMode)
    })
    this.mobileMediaQuery.addListener(() => this.closeListOnMobile())
    this.closeListOnMobile()
  },
  methods: {
    setDarkMode(darkMode) {
      this.mapUrl = darkMode ? theme.maps.dark.url : theme.maps.normal.url
      this.attribution = darkMode ? theme.maps.dark.attribution : theme.maps.normal.attribution
      this.countyStyle = darkMode ? theme.maps.dark.countyStyle : theme.maps.normal.countyStyle
    },
    // Closes the list when mobile or going to mobile as long as there are no filters selected;
    closeListOnMobile() {
      if (this.mobileMediaQuery.matches) {
        return
      }

      if (this.need !== 0) {
        return
      }

      if (this.day !== dayAny) {
        return
      }

      this.isFilterOpen = false
    },
    centerUpdated(center) {
      this.centroid = { lat: center.lat, lng: center.lng }
    },
    boundsUpdated(bounds) {
      this.bounds = bounds
    },
    getDay(day) {
      if (day == 0) {
        return 6
      } else {
        return day - 1
      }
    },
    boxSelected(content) {
      this.highlightFilters = addOrRemove(this.highlightFilters, content.need)
    },
    regionSelected(feature) {
      feature.toggle = !feature.toggle
      this.regionFilters = addOrRemove(this.regionFilters, feature.properties.CO_NAME)
    },
    isAnyDaySelected(day) {
      return day >= dayAny
    },
    isOpen(marker) {
      // TODO: redo open-closed
      // var today = new Date().getDay()
      // var selectedDay = today
      // if (!t.isAnyDaySelected(t.day)) {
      //   selectedDay = t.day
      // }
      // const dayFilter = dayFilters[t.getDay(selectedDay)]
      // var open = markers.filter((c) => c[dayFilter].$t !== '0')
      // var closed = markers.filter((c) => c[dayFilter].$t == '0')

      if (marker.openInfo) {
        return marker.openInfo.isOpenNow !== false
      } else {
        return marker.isOpen
      }
    },
    async needSelected(val) {
      const category = await this.$api.fetchByCategory(val)

      var markers = category.markers
      var filters = category.highlightFilters

      var retList = extend(
        markers.map((marker) => ({
          marker,
          oc: this.isOpen(marker),
          distance:
            marker.lat !== undefined && marker.lng !== undefined
              ? haversineDistance([this.centroid.lat, this.centroid.lng], [marker.lat, marker.lng], true)
              : 0
        }))
      ).sort(sortByDistance)

      this.filterOptions = filters.split(',').filter((opt) => opt !== null && opt != undefined && opt !== '')
      this.markers = retList
      this.need = val
      this.showList = val !== 0
      this.isListOnly = category.showListFirst
      this.showCounties = category.showCounties
      this.highlightFilters = []
      this.regionFilters = []
      this.locationData.currentBusiness = null
      this.warningMobile = null

      window.gtag('event', 'What do you need?', { event_category: 'Search - (' + this.language.name + ')', event_label: val })
    },
    async getRegionsArea() {
      const regions = await this.$api.getRegionsArea()
      var features = []
      regions.forEach((item) => {
        item.areaJson.toggle = false
        features.push(item.areaJson)
      })
      this.geoJson = {
        bbox: [-84.3216191348785, 33.8343686234225, -75.4599807261118, 36.5884147052891],
        features: features,
        type: 'FeatureCollection'
      }
    },
    changeLanguage(item) {
      this.language = item
      this.$root.updateLang(item.iso)
    },
    async fetchCategories() {
      const menu = await this.$api.getMenuSettings()
      this.neededCategories = menu.categories
    },
    async fetchData() {
      const entries = await this.$api.fetchData()
      this.entries = entries
    },
    updateShowList(val) {
      this.showList = val
    },
    closeDetails() {
      this.showList = true

      this.locationData = { currentBusiness: null }
    },
    async locationSelected(val) {
      const resource = await this.$api.getResource(val.locId)

      val.currentBusiness = resource
      this.locationData = val
      this.isFilterOpen = true
      this.showList = false

      var proName = this.filteredMarkers[val.locValue].marker.providerAddLoc
        ? ', ' + this.filteredMarkers[val.locValue].marker.providerAddLoc
        : ''

      window.gtag('event', val.isSetByMap ? 'Marker clicked' : 'List item clicked', {
        event_category: 'View details - (' + this.language.name + ')',
        event_label: this.filteredMarkers[val.locValue].marker.name + proName
      })
    },
    locationUnselected(isSetByMap) {
      this.locationData = { locValue: null, locId: null, currentBusiness: null, isSetByMap: isSetByMap }
      this.isFilterOpen = false
      this.showList = true
    }
  },
  computed: {
    filteredMarkers() {
      if (!this.markers) return null

      var markers = this.markers

      // Filter out the boolean items
      this.highlightFilters.forEach((element) => {
        markers = markers.filter((c) => {
          if (element === 'farmersmarket') {
            return c.marker.category.toLowerCase() === element
          } else {
            return c.marker.options.includes(element)
          }
        })
      })

      // Filter out the selected counties
      if (this.showCounties && this.regionFilters && this.regionFilters.length) {
        markers = markers.filter((c) => {
          let hasRegion = false

          this.regionFilters.forEach((element) => {
            c.marker.region.forEach((r) => {
              console.log(r.id.toLowerCase())
              if (r.id.toLowerCase() === element.toLowerCase()) {
                hasRegion = true
              }
            })
          })
          return hasRegion
        })
      }

      return markers
    },
    highlightFilteredMarkers() {
      var contained = [] //makers in map boundingbox

      this.filteredMarkers.forEach((m) => {
        if (m.marker.category === 'socialServices') {
          contained.push(m)
        }
        if (m.marker.lat !== undefined && m.marker.lng != undefined && this.bounds.contains(latLng(m.marker.lat, m.marker.lng))) {
          contained.push(m)
        }
      })

      if (!this.isAnyDaySelected(this.day)) {
        return contained
      }
      console.log(contained)
      return contained.map((m) => {
        let obj = Object.assign({}, m)
        obj.oc = m.oc
        return obj
      })
    },
    selectedGeoJson() {
      return this.showCounties ? this.geoJson : null
    }
  }
}
</script>

<style></style>
