<template>
  <div class="row highlights" v-if="valueBoxes[0] != null">
    <div class="col-6 col-md-3 order-md-1">
      <value-box :content="valueBoxes[0]" class="bg-tertiary" @box-selected="boxSelected" />
    </div>
    <div class="col-6 col-md-3 order-md-2">
      <value-box :content="valueBoxes[1]" class="bg-quaternary" @box-selected="boxSelected" />
    </div>
    <div class="col-6 col-md-3 order-md-4">
      <value-box :content="valueBoxes[2]" class="bg-quaternary" @box-selected="boxSelected" />
    </div>
    <div class="col-6 col-md-3 order-md-3">
      <value-box :content="valueBoxes[3]" class="bg-tertiary" @box-selected="boxSelected" />
    </div>
  </div>
</template>

<script>
import ValueBox from './ValueBox.vue'

import { optionIcon } from '../utilities'

export const countCategory = (filteredMarkers = [], category) =>
  (filteredMarkers || []).reduce((total, c) => (c.marker.category.toLowerCase() === category && c.oc > -1 ? total + 1 : total), 0)

export const countBoolean = (filteredMarkers, fieldName) =>
  (filteredMarkers || []).reduce((total, c) => (c.marker.options.includes(fieldName) && c.oc ? total + 1 : total), 0)

export default {
  name: 'Highlights',
  components: {
    ValueBox
  },
  props: {
    need: Number,
    filteredMarkers: Array,
    highlightFilters: Array,
    filterOptions: Array
  },
  methods: {
    boxSelected(content) {
      this.$emit('box-selected', content)
    },
    buildBoxValue(labelId, icon, count, pluralize = false) {
      const label = `label.${labelId.toLowerCase()}`
      var selected = this.highlightFilters !== undefined ? this.highlightFilters.includes(labelId) : ''

      return {
        icon,
        value: count,
        title: pluralize ? this.$tc(label, count) : this.$t(label),
        need: labelId,
        selected: selected
      }
    },
    countFilteredMarkers(filter) {
      if (filter === 'farmersmarket') {
        return countCategory(this.filteredMarkers, filter)
      } else {
        return countBoolean(this.filteredMarkers, filter)
      }
    }
  },
  computed: {
    valueBoxes() {
      if (!this.filterOptions) {
        return [null, null, null, null]
      }

      var valueBoxes = []

      for (var i = 0; i < this.filterOptions.length; i++) {
        var opt = this.filterOptions[i]
        valueBoxes.push(this.buildBoxValue(opt, optionIcon(opt), this.countFilteredMarkers(opt), true))
      }

      return valueBoxes
    }
  }
}
</script>

<style lang="scss">
.highlights {
  margin: 4px !important;
  transition: height 0.25s ease-out, margin 0.25s ease-out;
  height: 116px;

  @include media-breakpoint-up(sm) {
    height: 108px;
  }

  div.col-md-3 {
    padding: 0 !important;
  }
}

#wrapper.toggled .highlights {
  @include media-breakpoint-up(md) {
    margin-left: ($tablet-sidebar-width + 8px) !important;
  }

  @include media-breakpoint-up(lg) {
    margin-left: ($desktop-sidebar-width + 8px) !important;
  }
}
</style>
