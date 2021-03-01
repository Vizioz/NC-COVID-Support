<template>
  <div class="tag-list">
    <span class="tag" v-for="(tag, index) in tags" v-bind:key="index">{{ tag }}</span>
  </div>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    tags: Array[String]
  }
}
</script>

<style scoped lang="scss">
.tag-list {
  margin-bottom: 6px;

  .tag {
    padding: 2px 6px;
    font-size: 0.7rem;
    border-radius: 12px;
    background: theme-color('tertiary');
    display: inline-block;
    margin-bottom: 4px;

    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}
</style>
