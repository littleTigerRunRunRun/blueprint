<template>
  <div
    class="graph-node-end"
    :class="{
      selected: data?.selected
    }"
    :style="{
      width: `${data?.width}px`,
      height: `${data?.height}px`,
      lineHeight: `${data?.height}px`
    }"
  >
    <span>{{ data?.label }}</span>
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
.graph-node-end {
  background-color: #333;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  user-select: none;
  span {
    position: absolute;
    bottom: 0px;
    left: 50%;
    font-size: 14px;
    line-height: 24px;
    font-family: 微软雅黑;
    font-weight: bold;
    color: #333;
    transform: translate(-50%, 100%);
    word-wrap: break-word;
    word-break: break-all;
    white-space: nowrap;
  }
  &.selected {
    background-color: #1890ff;
  }
}
</style>
