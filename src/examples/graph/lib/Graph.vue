<template>
  <!-- 方便用户快速定义自己需要的graph的vue模版文件 -->
  <div
    class="graph-container"
    :style="containerStyle"
  >
    <!-- 预设箭头 -->
    <svg>
      <defs>
        <!-- 平箭头 -->
        <marker
          id="graph_connection_arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" stroke="none" />
        </marker>
        <!-- 尾翼箭头 -->
        <marker
          id="graph_connection_arrow_sharp"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 L3,5 z" fill="context-stroke" stroke="none" />
        </marker>
      </defs>
    </svg>
    <div class="rete-basic-container" ref="containerRef" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import type { GCSApp } from './define';

let containerStyle = ''
const { app } = defineProps<{
  app: GCSApp
}>()

onBeforeMount(() => {
  containerStyle = `
    ${app.tools.background}
  `
  console.log(containerStyle)
})

const defineCustomPattern = () => {
  
}

defineExpose({
  defineCustomPattern
})
</script>

<style lang="scss" scoped>
.graph-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>