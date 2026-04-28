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
    
    <!-- 主工具栏 - 一般是那个固定在界面上不动的常驻工具栏，不过并非所有的编辑器都存在这样一个工具栏 -->
    <Toolbar
      v-if="mainToolBar"
      name="main"
      :setting="mainToolBar"
    >
      <!-- 插槽穿透 -->
      <template v-for="(slotName, ti) in mainToolSlots" :key="`slot_main_${ti}`" #[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template>
    </Toolbar>
    <!-- 资产工具栏 - 一般是一个具有大量可拖拽生成内容的工具栏 -->
    <Toolbar
      v-if="assetToolBar"
      name="asset"
      :setting="assetToolBar"
    >
      <!-- 插槽穿透 -->
      <template v-for="(slotName, ti) in assetToolSlots" :key="`slot_main_${ti}`" #[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template>
    </Toolbar>
    <!-- 浮窗工具栏 - 一般是一在某个内容被选中后出现的有针对性选项的工具栏 -->
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import type { GCSApp, BaseGraphDefine, ToolListSetting } from './define';
import { Toolbar } from './view/'

// 
const containerRef = ref<HTMLDivElement|null>(null)
let containerStyle = ''
const { app } = defineProps<{
  app: GCSApp<BaseGraphDefine>
}>()

let mainToolBar:Required<ToolListSetting>
let mainToolSlots:Array<string>
let assetToolBar:Required<ToolListSetting>
let assetToolSlots:Array<string>

onBeforeMount(() => {
  containerStyle = `
    ${app.tools.background || ''}
    ${app.tools.innerShadow || ''}
  `
  console.log(containerStyle)

  ;(app.arrayTools.toolList as Required<ToolListSetting>[]).forEach((tool) => {
    switch (tool.name) {
      case 'main':
        mainToolBar = tool
        mainToolSlots = tool.content.filter((tool) => tool.type === 'custom').map((tool) => `main_tool_${tool.name}`)
        break
      case 'asset':
        assetToolBar = tool
        assetToolSlots = tool.content.filter((tool) => tool.type === 'custom').map((tool) => `asset_tool_${tool.name}`)
        break
    }
  })
})

// 
onMounted(() => {
  if (containerRef.value) app.container = containerRef.value
})

const defineCustomPattern = () => {
  
}

// 输出接口
defineExpose({
  defineCustomPattern
})
</script>

<style lang="scss" scoped>
.graph-container {
  position: relative;
  width: 100%;
  height: 100%;
  * {
    font-family: HarmonyOS Sans SC;
  }
  & > svg {
    position: absolute;
    left: 100%;
    top: 100%;
  }
  .rete-basic-container {
    width: 100%;
    height: 100%;
  }
}
</style>