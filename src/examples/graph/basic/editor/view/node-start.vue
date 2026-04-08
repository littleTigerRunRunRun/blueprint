<template>
  <div
    class="graph-node-start"
    :class="{
      selected
    }"
    :style="{
      width: `${data!.width + 4}px`,
      height: `${data!.height + 4}px`
    }"
  >
    <span>{{ data?.label }}</span>
  </div>
</template>

<script lang="ts" setup>
import { UniNode } from '../tool/uniNode'

const { data } = defineProps({
  data: UniNode,
  selected: Boolean
})
</script>

<style lang="scss">
.graph-node-start {
  position: absolute;
  left: -2px;
  top: -2px;
  border: 4px solid #666;
  background-color: #fff;
  border-radius: 50%;
  text-align: center;
  user-select: none;
  span {
    position: absolute;
    bottom: -4px;
    left: 50%;
    font-size: 14px;
    line-height: 24px;
    font-family: 微软雅黑;
    font-weight: bold;
    color: #666;
    transform: translate(-50%, 100%);
    word-wrap: break-word;
    word-break: break-all;
    white-space: nowrap;
  }
  &.selected {
    border-color: #1890ff;
    span {
      color: #1890ff;
    }
  }
}
</style>
