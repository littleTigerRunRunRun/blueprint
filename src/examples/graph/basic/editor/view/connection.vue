<template>
  <svg class="graph-connection" :class="{ selected: data?.selected }">
    <path :d="path" class="interval-path" @click="handleSelect" />
    <path :d="path" class="view-path" />
  </svg>
</template>

<script lang="ts" setup>
import { global } from '../global';
const { path, data } = defineProps(['path', 'data'])
const emit = defineEmits(['update:data'])

const handleSelect = () => {
  const gcs = global.connectionSelector
  gcs.selector.add(
    {
      id: data.id,
      label: '',
      translate() {},
      unselect: () => {
        data.selected = false
        emit('update:data', data)
        gcs.area.update("connection", data.id);
      }
    },
    gcs.accumulating.active()
  );
  data.selected = true
  emit('update:data', data)
  gcs.area.update("connection", data.id);
}
</script>

<style lang="scss">
.graph-connection {
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;
  z-index: -2;
  &.selected {
    z-index: -1;
    .view-path {
      stroke: #1890ff;
    }
  }
  .view-path {
    fill: none;
    stroke-width: 2.5px;
    stroke: #666;
    pointer-events: none;
  }
  .interval-path {
    fill: none;
    stroke-width: 6px;
    stroke: #f00;
    stroke-opacity: 0.05;
    pointer-events: auto;
    cursor: pointer;
  }
}
</style>
