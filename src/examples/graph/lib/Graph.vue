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
    
    <!-- 工具栏 -->
    <div className="graph-toolbars">
      <div class="graph-toolbar graph-toolbar-main">

      </div>
      <!-- <template v-for="(t, ti) in toolbarList" :key="`tool_${ti}`">
        <a-tooltip
          :title="t.label"
          color="#35bfff"
          overlayClassName="graph-asset-tooltip"
        >
          <a-dropdown v-if="t.params" overlayClassName="graph-button-dropdown">
            <a-button type="primary" shape="circle" class="graph-tool-button" :icon="h(t.icon.value || t.icon)" @click="(!t.params) ? editorExec[t.name](t.value) : ''" />
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-for="(par, pi) in t.params"
                  :key="`bp_${pi}`"
                >
                  <a-tooltip
                    :title="par.label"
                    color="#35bfff"
                    placement="left"
                    overlayClassName="graph-asset-tooltip"
                  >
                    <a-button class="graph-tool-button" type="primary" shape="circle" :icon="h(par.icon)" @click="t.icon.value = par.icon, editorExec[t.name](par.value)" />
                  </a-tooltip>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button v-else type="primary" class="graph-tool-button" shape="circle" :icon="h(t.icon)" @click="editorExec[t.name](t.value)" />
        </a-tooltip>
        <div v-if="t.split" class="split" />
      </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import type { GCSApp, BaseGraphDefine } from './define';

let containerStyle = ''
const { app } = defineProps<{
  app: GCSApp<BaseGraphDefine>
}>()

const mainToolBar = {
  show: false
}

onBeforeMount(() => {
  containerStyle = `
    ${app.tools.background || ''}
    ${app.tools.innerShadow || ''}
  `
  console.log(containerStyle)

  app.arrayTools.toolList?.forEach((tool) => {
    switch (tool.name) {
      case 'main':
        mainToolBar.show = true // 显示主工具栏
        break
    }
  })
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