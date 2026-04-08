<template>
  <div class="graph-socket" :title="data.name" />
</template>

<script lang="ts" setup>
const { data } = defineProps(['data'])
</script>

<style lang="scss" scoped>
  @use "sass:math";
  
  .graph-socket {
    width: 100%;
    height: 100%;
  }
</style>
