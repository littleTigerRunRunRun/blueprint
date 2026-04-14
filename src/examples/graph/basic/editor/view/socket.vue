<template>
  <div
    class="graph-socket"
    :title="data.name"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  />
</template>

<script lang="ts" setup>
import { subscriber } from '../tool/Subscriber'

const { data, nodeId } = defineProps(['data', 'nodeId'])

const handleMouseEnter = () => {
  subscriber.set('hoveringSocket', {
    nodeId,
    key: data.name
  })
}
const handleMouseLeave = () => {
  subscriber.set('hoveringSocket', null)
}
</script>

<style lang="scss" scoped>
  @use "sass:math";
  
  .graph-socket {
    width: 100%;
    height: 100%;
  }
</style>
