<template>
  <div class="graph-with-constraint">
    <Graph
      v-if="startGraphRender"
      ref="graphRef"
      :app="app"
    >
      <template #main_tool_scale>
        <scale-tool />
      </template>
    </Graph>
    <div class="show-log-button" @click="showDrawer">功能日志</div>
    <a-drawer
      v-model:open="open"
      class="custom-class"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      style="color: red"
      title="通用原型封装功能日志"
      placement="left"
    >
      <div
        v-for="(l, li) in log"
        class="develop-log"
        :key="`log_${li}`"
        style="font-family: 微软雅黑; margin-bottom: 12px;"
      >
        <div class="title">{{ l.date }}</div>
        <div class="content">{{ l.func }}</div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Graph, app, GraphExec } from '../lib'
import type { GraphMain } from '../lib'
// import {} from './define'
import ScaleTool from './components/scale-tool.vue'
import { toggleFullscreen } from './tool'
import log from '../lib/log.json'
import { editor } from './index'

const graphRef = ref<GraphMain | null>(null)
const startGraphRender = ref(false)

// const app = new GraphApp<MyExecutor>()

// 测试：使用纯色背景
app.set('pureBG', '#f2f2f2')
// 测试：使用点阵背景
// 注意:pureBG、pointBG和gridBG指令都属于自定义背景色，其存在会出现冲突，以最后一个set者为准
// app.set('pointBG', { background: '#f2f2f2', point: { color: '#ddd', interval: 18, r: 2 } })
// 测试：使用网格背景
// app.set('gridBG', { background: '#ffe4e4', mainGrid: { interval: 200, width: 1.5, color: '#ff5455' }, subGrid: { interval: 25, width: 1, color: '#ffa8a9' } })
// app.set('gridBG', { background: '#222', mainGrid: { interval: 200, width: 1.5, color: '#666' }, subGrid: { interval: 25, width: 1, color: '#555' } })

// 测试：使用内阴影
// app.set('innerShadow', { color: '#333', intensity: 2 })

// 定义一些内外联动用的工具
// app.defineAsset('', )

// 设置主工具栏
app.set('toolList', {
  name: 'main',
  layoutDirection: 'h',
  size: 32,
  orientation: {
    ori: 'rb',
    right: 20,
    bottom: 20
  },
  content: [
    { type: 'button', icon: 'mouse', exec: '', tooltip: '鼠标状态' },
    { type: 'seperate', size1: 1, size2: 16, padding: [4, 4] }, 
    { type: 'button', icon: 'placeholder', exec: '', tooltip: '网格' },
    { type: 'seperate', size1: 1, size2: 16, padding: [4, 4] }, 
    { type: 'switch', icon: 'collapse', exec: '', tooltip: '全屏状态' },
    { type: 'seperate', size1: 1, size2: 16, padding: [4, 4] }, 
    { type: 'button', icon: 'fitContent', exec: '', tooltip: '最佳适配，会根据内容尽可能地将内容以最佳的比例全部展示出来' },
    { type: 'seperate', size1: 1, size2: 16, padding: [4, 4] }, 
    { type: 'custom', name: 'scale' }
  ]
})

// 设置左侧资产工具栏
app.set('toolList', {
  name: 'asset',
  layoutDirection: 'v',
  size: 40,
  orientation: {
    ori: 'l',
    left: 12
  },
  content: [
    { type: 'drawer', icon: 'shape', tooltip: '形状', tools: [] },
    { type: 'seperate', size1: 0, size2: 0, padding: [4, 4] }, 
    { type: 'drawer', icon: 'placeholder', tooltip: '模版', tools: [] },
    { type: 'seperate', size1: 0, size2: 0, padding: [4, 4] }, 
    { type: 'drag', icon: 'line', tooltip: '连线', asset: '' },
    { type: 'seperate', size1: 0, size2: 0, padding: [4, 4] }, 
    { type: 'drag', icon: 'placeholder', tooltip: '圆角矩形', asset: '' },
    { type: 'seperate', size1: 0, size2: 0, padding: [4, 4] }, 
    { type: 'drag', icon: 'diamond', tooltip: '菱形', asset: '' },
    { type: 'seperate', size1: 0, size2: 0, padding: [4, 4] }, 
    { type: 'drag', icon: 'placeholder', tooltip: '椭圆', asset: '' },
  ]
})

// 设置可拖拽的资产
// app.set('assets')

// 自定义可调用指令exec
app.set('exec', [
  // 配置了名为fullscreen的自定义指令
  { name: 'fullscreen', exec: () => {
    toggleFullscreen()
  }}
])

// 绑定各种键盘快捷键
app.set('keyboard', [
  { key: 'delete', exec: GraphExec.DELETE_SELECT },
  { key: 'tab', exec: GraphExec.ADD_NODE },
  // 绑定了按键f到自定义指令fullscreen
  { key: 'f', exec: 'fullscreen' }
])

// 定义右键菜单
// 本项目好像暂时未用到右键菜单，因此暂时不用接入
// app.set('contextmenu')

// 监听onReady事件告诉什么时候可以开始渲染editor
app.onReady = (container:HTMLDivElement) => {
  editor.init(container)
}

// 初始化完app后开始渲染graph基底dom内容
startGraphRender.value = true

// 查看开发日志新增内容
const open = ref<boolean>(false)
const showDrawer = () => {
  open.value = true
}
</script>

<style lang="scss" scoped>
.graph-with-constraint {
  position: relative;
  width: 100%;
  height: 100%;
  .show-log-button{
    position: absolute;
    left: 20px;
    top: 20px;
    padding: 8px 12px;
    border: 1px solid #000;
    cursor: pointer;
    transition: color 0.3s, border-color 0.3s;
    &:hover {
      color :#66aaff;
      border-color: #66aaff;
    }
  }
}
</style>
<style lang="scss">
.custom-class{
  .title {
    color: #66aaff;
    font-size: 14px;
    font-weight: bold;
  }
  .content {
    color: #333;
    font-size: 14px;
  }
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>