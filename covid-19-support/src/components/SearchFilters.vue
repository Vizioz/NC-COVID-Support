<template>
  <b-list-group class="need-day-group">
    <b-list-group-item variant="sideNav" class="need-type">
      <h6>{{ $t('sidebar.what-do-you-need') }}</h6>
      <b-form-select class="custom-select" :value="need" :options="needOptionGroups" @change="(opt) => $emit('need-selected', opt)" />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  data() {
    return {
      locationData: location,
      showListing: this.showList
    }
  },
  props: {
    need: Number,
    neededCategories: Array
  },
  computed: {
    needOptionGroups() {
      const needOptions = [{ value: 0, text: this.$tc('label.selectacategory', 1) }]

      if (!this.neededCategories) {
        return needOptions
      }

      this.neededCategories.forEach((category) => {
        if (category.subcategories != undefined) {
          const myOptions = []
          category.subcategories.forEach((subcategory) => {
            myOptions.push({
              text: subcategory.code ? this.$tc('category.' + subcategory.code) : subcategory.name,
              value: subcategory.id
            })
          })
          needOptions.push({
            label: category.code ? this.$tc('category.' + category.code) : category.name,
            options: myOptions
          })
        } else {
          needOptions.push({
            text: category.code ? this.$tc('category.' + category.code) : category.name,
            value: category.id
          })
        }
      })

      return needOptions
    }
  }
}
</script>

<style lang="scss" scoped>
.list-group-item {
  border: none !important;
  padding: 0 1.25rem;
  border-bottom: none;

  &.need-type {
    margin-bottom: 8px;
  }
}

.list-group-flush.need-day-group .list-group-item:first-child {
  padding-bottom: 1rem !important;
}
</style>
