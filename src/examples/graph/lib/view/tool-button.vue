<template>
  <a-tooltip
    v-if="tooltip"
    color="#000"
    :title="tooltip"
    :placement="placement"
    overlayClassName="graph-asset-tooltip"
  >
    <div
      class="tool-button"
      :style="{
        width: `${size}px`,
        height: `${size}px`
      }"
      :class="{
        outline
      }"
    >
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="`#icon-${icon}`"></use>
      </svg>
    </div>
  </a-tooltip>
  
  <div
    v-else
    class="tool-button"
    :style="{
      width: `${size}px`,
      height: `${size}px`
    }"
    :class="{
      outline
    }"
  >
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="`#icon-${icon}`"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
const {
  tooltip,
  placement,
  size,
  icon,
  outline
} = defineProps<{
  tooltip?: string
  placement?: string
  size: number
  icon: string
  outline?: boolean
}>()
</script>

<style lang="scss" scoped>
.tool-button{
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  &.outline{
    &:hover {
      color: #1890FF;
    }
  }
  &:not(.outline) {
    &:hover {
      background-color: #1890FF26;
      color: #1890FF;
    }
  }
  svg {
    width: 100%;
    height:100%;
  }
}
</style>