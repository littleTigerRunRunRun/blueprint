<template>
  <div class="tool-scale">
    <tool-button
      icon="minus"
      :size="32"
      :outline="true"
    />
    <div class="scale">
      <span>{{ scale }}%</span>
    </div>
    <tool-button
      icon="plus"
      :size="32"
      :outline="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ToolButton } from '../../lib'

const scale = ref(100)
</script>

<style lang="scss" scoped>
.tool-scale{
  display: inline-block;
  vertical-align: middle;
  width: 104px;
  height: 32px;
  font-size: 0px;
  white-space: nowrap;
  word-wrap: break-word;
  word-break: break-all;
  &>div{
    vertical-align: middle;
  }
  .scale{
    position: relative;
    display: inline-block;
    width: 32px;
    padding: 0 4px;
    font-size: 12px;
    font-weight: bold;
    color: #090909;
    cursor: default;
    user-select: none;
    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>