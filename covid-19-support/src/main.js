// *** NOTES ***
// The following files are included globally in the vue.config.js file so that
// we are able to use the SASS variables in the main CSS file and the component files.
// ./node_modules/bootstrap/scss/_functions.scss - The Bootstrap Functions
// ~bootstrap/scss/variables - The default Bootstrap Variables
// ~bootstrap/scss/mixins - The Bootstrap Minins
// ./src/themes/${process.env.VUE_APP_THEME}/SCSS/custom.scss - Our "theme" SCSS

import Vue from 'vue'
import VueScreen from 'vue-screen'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BootstrapVue } from 'bootstrap-vue' // IconsPlugin
import i18n from './i18n'

import App from './App.vue'

// import ProviderFactory from './api/apiProvider'
// import { theme } from 'theme.config'

import './ExtraMarkers/css/leaflet.extra-markers.min.css'
import './ExtraMarkers/js/leaflet.extra-markers.min.js'

import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// REQUIRED - Importing Bootstrap and BootstrapVue
import './scss/bootstrap.scss'

// REQUIRED - Importing our Main CSS file
import './scss/main.scss'

// General style overrides and custom classes

// Install Vue Screen
Vue.use(VueScreen, 'bootstrap')

// Http client
Vue.use(VueAxios, axios)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)

Vue.config.productionTip = true

new Vue({
  i18n,
  render: (h) => h(App),
  methods: {
    updateLang(iso) {
      i18n.locale = iso
    }
  },
  created() {
    //ProviderFactory.setProvider(theme.data.provider, theme.data.url)
  }
}).$mount('#app')
