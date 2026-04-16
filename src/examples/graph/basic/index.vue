<template>
  <div class="graph-basic">
    <!-- 顶部工具栏 -->
    <div className="graph-toolbar">
      <template v-for="(t, ti) in toolbarList" :key="`tool_${ti}`">
        <a-tooltip
          :title="t.label"
          color="#35bfff"
          overlayClassName="graph-asset-tooltip"
        >
          <a-dropdown v-if="t.params" overlayClassName="graph-button-dropdown">
            <!-- :trigger="['click']" -->
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
      </template>
    </div>
    <!-- 左侧资产栏 -->
    <div className="asset-list">
      <a-tooltip
        v-for="(a, ai) in assetsList"
        :key="`tool_${ai}`"
        :title="a.label"
        color="#35bfff"
        overlayClassName="graph-asset-tooltip"
        placement="right"
      >
        <a-button
          type="primary"
          size="48"
          :icon="h(a.icon)"
          @mousedown="
            () => {
              if (typeof assetNode[a.name] === 'string') {
                // @ts-ignore
                editorExec[assetNode[a.name]]()
              } else {
                dragging = assetNode[a.name] as RawDataFlowNode
              }
            }
          "
        />
      </a-tooltip>
    </div>
    <div class="rete-basic-container" ref="containerRef"></div>
    <svg>
      <defs>
        <marker
          id="graph_connection_arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <!-- 尾翼箭头 -->
          <path d="M0,0 L10,5 L0,10 L3,5 z" fill="context-stroke" stroke="none" />
          <!-- 平箭头 -->
          <!-- <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" stroke="none" /> -->
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref, h, watch } from 'vue'
import { toolbarList, assetsList, assetNode } from './tools'
import { GraphExec, makeupEditor, GraphAbility } from './editor'
import type { GraphExecCallback, RawDataFlowNode } from './editor'

const containerRef: Ref<HTMLElement | undefined> = ref(undefined)

// 向渲染器中注入基本的节点、连接的视图模板
let editorExec: GraphExecCallback
const dragging = ref<RawDataFlowNode | null>(null)
watch(
  () => dragging.value,
  () => {
    if (editorExec && dragging.value) editorExec.dropAdd(dragging.value)
  }
)

const onDragEnd = () => {
  editorExec.dropAdd(null)
}

onMounted(async () => {
  if (containerRef.value)
    editorExec = await makeupEditor({
      container: containerRef.value,
      eventHandlers: {
        // 回调事件响应
        onNodeAdd: (node) => {
          // 这里改变了有限次数节点的调用次数，当调用次数为0时，对应的节点将无法被拖拽
          // props.checkInstanceNumChange(node.name, -1)
        },
        onNodeRemove: (node) => {
          // props.checkInstanceNumChange(node.name, 1)
        },
        onNodeSelected: (node) => {
          // console.log('selected', node)
        },
        onNodeUnselected: (node) => {
          // console.log('unselected', node)
        }
      },
      abilities: [GraphAbility.NODE_SELECTABLE]
    })

  document.body.addEventListener('mouseup', onDragEnd)
  document.body.addEventListener('mouseleave', onDragEnd)

  // 测试用
  editorExec[GraphExec.IMPORT]()
})

onBeforeUnmount(() => {
  document.body.removeEventListener('mouseup', onDragEnd)
  document.body.removeEventListener('mouseleave', onDragEnd)
})
</script>

<style lang="scss">
@import url('./editor/style/contextmenu.scss');
@import url('./editor/style/main.scss')
</style>
