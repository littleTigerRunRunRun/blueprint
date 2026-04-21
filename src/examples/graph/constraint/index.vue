<template>
  <div class="graph-with-constraint">
    <Graph ref="graphRef" :app="app">
    </Graph>
  </div>
</template>

<script setup lang="ts">
import { GE, Graph, app } from '../lib'
import type { GraphMain } from '../lib'
import { ref, onMounted } from 'vue'

const graphRef = ref<GraphMain | null>(null)

// 测试：使用纯色背景
app.set('pureBG', '#f2f2f2')
// 测试：使用点阵背景
// 注意:pureBG、pointBG和gridBG指令都属于自定义背景色，其存在会出现冲突，以最后一个set者为准
// app.set('pointBG', { background: '#f2f2f2', point: { color: '#ddd', interval: 18, r: 2 } })
// 测试：使用网格背景
// app.set('gridBG', { background: '#ffe4e4', mainGrid: { interval: 200, width: 1.5, color: '#ff5455' }, subGrid: { interval: 25, width: 1, color: '#ffa8a9' } })
// app.set('gridBG', { background: '#222', mainGrid: { interval: 200, width: 1.5, color: '#666' }, subGrid: { interval: 25, width: 1, color: '#555' } })

// 定义一些内外联动用的工具
// app.defineAsset('', )

app.set('toolList', {
  name: 'main'
})

// onMounted(() => {
//   if (graphRef.value) {
//     console.log(graphRef.value.defineCustomPattern)
//   }
// })
app.defineGraph(GE.NODE, 'rect', {
  width: 80,
  height: 53
})

</script>

<style lang="scss" scoped>
.graph-with-constraint {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>