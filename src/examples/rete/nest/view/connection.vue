<template>
  <svg data-testid="connection">
    <path :d="path"></path>
  </svg>
</template>

<script>
import { defineComponent, watch } from 'vue'

export default defineComponent({
  props: ['data', 'start', 'end', 'path'],
  setup(props) {
    // console.log('data', props.data)
    // watch(() => props.path, (value) => {
    //   console.log('path', props.start, props.end, props.path)
    // })
  }
})
</script>

<style lang="scss" scoped>
svg {
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;
  path {
    fill: none;
    stroke-width: 2.5px;
    stroke: #fff;
    pointer-events: auto;
  }
}
</style>