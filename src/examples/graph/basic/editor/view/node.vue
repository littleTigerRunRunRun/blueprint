<template>
  <div
    class="graph-node"
    :class="{
      selected: data?.selected
    }"
    :style="{
      width: `${data?.width}px`,
      height: `${data?.height}px`,
      lineHeight: `${data?.height}px`
    }"
  >
    {{ data?.label }}
  </div>
</template>

<script lang="ts" setup>
import { UniNode } from '../uniNode'

const { data } = defineProps({
  data: UniNode
})

console.log(data)
</script>

<style lang="scss">
.graph-node {
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 4px;
  text-align: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  box-sizing: content-box;
  &.selected {
    border-color: #1890ff;
  }
}
</style>
