<script lang="ts">

import {DataProvider, ProviderConfig} from './dataProvider.vue' 

var getCategories = function() {
  return []
};

var getResources = function(category: string) {
  return []
};

var getResource = function(id: number) {
  return null
};

var config = new ProviderConfig(getCategories, getResources, getResource)

</script>