<template>
  <div
    class="graph-node-end"
    :class="{
      selected,
      status
    }"
    :style="{
      width: `${data?.width}px`,
      height: `${data?.height}px`
    }"
  >
    <span>{{ data?.label }}</span>
  </div>
</template>

<script lang="ts" setup>
import { UniNode } from '../tool/uniNode'

const { data, selected, status } = defineProps({
  data: UniNode,
  selected: Boolean,
  status: Boolean
})
</script>

<style lang="scss">
.graph-node-end {
  background-color: #666;
  border-radius: 50%;
  text-align: center;
  user-select: none;
  span {
    position: absolute;
    bottom: 0px;
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
    background-color: #1890ff;
    span {
      color: #1890ff;
    }
  }
  &.status {
    background-color: #11b949;
    span {
      color: #11b949;
    }
  }
}
</style>
