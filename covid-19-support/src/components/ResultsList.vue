<template>
  <div class="resultWrapper">
    <b-list-group ref="results" class="resultList list-group-flush">
      <b-list-group-item
        action
        variant="sideNav"
        v-for="(item, index) in filteredMarkers"
        v-bind:key="index"
        class="resultItem"
        :class="{ selected: index == location.locValue, closedOne: item.oc == false }"
        :ref="'result' + index"
        @click="$emit('location-selected', { locValue: index, locId: item.marker.id, isSetByMap: false })"
      >
        <h5 class="resultTitle">{{ item.marker.name }}</h5>
        <template v-if="!!item.marker.providerAddLoc">
          <div class="addloc">{{ item.marker.providerAddLoc }}</div>
        </template>
        <div v-if="!item.oc" class="closed">{{ getClosedMessage() }}</div>
        <span class="resultAddress">
          <span v-if="!!item.marker.classificationType">{{ item.marker.classificationType }}<br /></span>
          {{ item.marker.address }}{{ item.marker.addresss !== '' ? ',' : '' }}
          {{ item.marker.city }}
        </span>
        <template v-for="(opt, index) in item.marker.options">
          <span v-bind:key="index" :title="$tc('label.' + opt.toLowerCase(), 1)">
            <i :class="getClassIcon(opt)" />
          </span>
        </template>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { weekdaysJs } from '../constants'

import { optionIcon } from '../utilities'

export default {
  name: 'ResultsList',
  data() {
    return {
      selected: false,
      today: new Date().getDay()
    }
  },
  components: {},
  props: {
    filteredMarkers: Array,
    location: { locValue: Number, isSetByMap: Boolean },
    selectedDay: Number
  },
  watch: {
    location(locationVal) {
      if (locationVal.isSetByMap) {
        var top = this.$refs['result' + locationVal.locValue][0].offsetTop - 330
        this.$refs['results'].scrollTo(0, top)
      }
    }
  },
  methods: {
    getClosedMessage() {
      if (this.selectedDay > 6) {
        return this.$t(`label.closed-today`)
      }

      return `${this.$t('label.closed-on')} ${this.$t(`dayofweek.${weekdaysJs[this.selectedDay].day}`)}`
    },
    getClassIcon(option) {
      return 'fas ' + optionIcon(option)
    }
  }
}
</script>

<style lang="scss">
.resultWrapper {
  scrollbar-color: $gray-900 $gray-700;
  border-top: 1px solid #ddd;
}

.addloc {
  margin-bottom: 8px;
}

.resultList {
  overflow-y: overlay;
  max-height: calc(100vh - #{$mobile-search-filters-height + $mobile-nav-height});
  max-height: calc(100vh - 37px);
  padding-bottom: $mobile-map-list-toggle-height;

  @include media-breakpoint-up(md) {
    margin-top: 0;
    padding-bottom: 0;
    max-height: calc(100vh - 268px);
  }
  @include media-breakpoint-up(lg) {
    max-height: calc(100vh - 230px);
  }
}

.resultItem {
  padding: 10px;
  display: block;
  border-bottom: solid 1px rgba(0, 0, 0, 0.125);
  font-size: 0.8rem;
  cursor: pointer;
  //background: #fff;

  // @media (prefers-color-scheme: dark) {
  //   //color: $gray-100;
  //   //background: $gray-800;
  // }

  // a {
  //   //color: #000;
  // }

  & > span > i {
    margin-right: 8px;
    color: theme-color('tertiary');
    font-size: 1rem;
    margin-top: 6px;
  }
}

.resultTitle {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.resultAddress {
  font-size: 0.8rem;
  display: block;
  max-width: 262px;
}
// .closedOne {
//   /* background: #f9f9f9 !important; */
// }
</style>
