<template>
  <div
    class="graph-node"
    :class="{
      selected
    }"
    :style="{
      // 这里的2对应的是.graph-node的border-width
      width: `${data!.width + 2}px`,
      height: `${data!.height + 2}px`,
      lineHeight: `${data!.height - 2}px`
    }"
  >
    <span
      contenteditable="true"
      @input="handleChange"
    >{{ data?.label }}</span>
    <span>{{ data?.id }}</span>
  </div>
</template>

<script lang="ts" setup>
import { UniNode } from '../tool/uniNode'

const { data } = defineProps({
  data: UniNode,
  selected: Boolean
})

const handleChange = (val:InputEvent) => {
  // @ts-ignore
  const text = val?.target?.innerText
  if (data) data.label = text
}
</script>

<style lang="scss">
.graph-node {
  position: absolute;
  left: -1px;
  top: -1px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 4px;
  text-align: center;
  color: #333;
  font-size: 14px;
  user-select: none;
  box-sizing: border-box;
  &.selected {
    border-color: #1890ff;
  }
  span:focus-visible {
    border: none;
    outline: none;
    padding: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
