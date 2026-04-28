<template>
  <a-tooltip
    color="#000"
    :title="tooltip"
    :placement="placement"
    overlayClassName="graph-asset-tooltip"
  >
    <div
      class="tool-switch"
      :style="{
        width: `${size}px`,
        height: `${size}px`
      }"
    >
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="`#icon-${icon}`"></use>
      </svg>
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
const {
  tooltip,
  placement,
  size,
  icon
} = defineProps<{
  tooltip: string
  placement: string
  size: number
  icon: string
}>()
</script>

<style lang="scss" scoped>
.tool-switch{
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  border-radius: 4px;
  transition: background-color 0.3s;
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
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
  }
}
</style>