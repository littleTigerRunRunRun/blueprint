<template>
  <div class="graph-basic">
    <!-- 顶部工具栏 -->
    <div className="graph-toolbar">
      <a-tooltip
        v-for="(t, ti) in toolbarList"
        :key="`tool_${ti}`"
        :title="t.label"
        color="#35bfff"
      >
        <a-button type="primary" shape="circle" :icon="h(t.icon)" @click="editorExec[t.name]()" />
      </a-tooltip>
    </div>
    <!-- 左侧资产栏 -->
    <div className="asset-list">
      <a-tooltip
        v-for="(a, ai) in assetsList"
        :key="`tool_${ai}`"
        :title="a.label"
        color="#35bfff"
        overlayClassName="graph-asset-tooltip"
      >
        <a-button
          type="primary"
          size="48"
          :icon="h(a.icon)"
          @mousedown="
            () => {
              dragging = assetNode[a.name]
            }
          "
        />
      </a-tooltip>
    </div>
    <div class="rete-basic-container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, type Ref, h, watch } from 'vue'
import { toolbarList, assetsList, assetNode } from './tools'
import { GraphExec, makeupEditor, GraphAbility } from './editor'
import type { GraphExecCallback, RawDataFlowNode, GraphEditor, GraphExecNoParamCallback } from './editor'

const containerRef: Ref<HTMLElement | undefined> = ref(undefined)

// 向渲染器中注入基本的节点、连接的视图模板
let editorExec: GraphExecNoParamCallback & { [GraphExec.DROP_ADD]: GraphEditor['dropAdd'] }
const dragging = ref<RawDataFlowNode | null>(null)
watch(
  () => dragging.value,
  () => {
    if (editorExec) editorExec.dropAdd(dragging.value)
  }
)

const onDragEnd = () => {
  dragging.value = null
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
@use "sass:color";
@import url('./editor/style/contextmenu.scss');

.graph-basic {
  position: relative;
  width: 100%;
  height: 100%;
  /* 黑底 */
  // background-color: #262626;
  // background-image: linear-gradient(#0f0f0f 1.5px, transparent 1.5px),
  //   linear-gradient(90deg, #0f0f0f 1.5px, transparent 1.5px),
  //   linear-gradient(#333333 1.5px, transparent 1.5px),
  //   linear-gradient(90deg, #333333 1.5px, #262626 1.5px);
  /* 白底：测试用 */
  background-color: #ffffff;
  background-image: linear-gradient(#d0d0d0 1.5px, transparent 1.5px),
    linear-gradient(90deg, #d0d0d0 1.5px, transparent 1.5px),
    linear-gradient(#e7e7e7 1.5px, transparent 1.5px),
    linear-gradient(90deg, #e7e7e7 1.5px, transparent 1.5px);
  background-size:
    200px 200px,
    200px 200px,
    25px 25px,
    25px 25px;
  background-position:
    -1.5px -1.5px,
    -1.5px -1.5px,
    -1.5px -1.5px,
    -1.5px -1.5px;
  box-shadow:
    inset 4px 0 5px 0 rgba(0, 0, 0, 0.05),
    inset -4px 0 5px 0 rgba(0, 0, 0, 0.05),
    inset 4px 0 5px 0 rgba(0, 0, 0, 0.05),
    inset -4px 0 5px 0 rgba(0, 0, 0, 0.05),
    inset 0px 0 3px 0 rgba(0, 0, 0, 0.1),
    inset 0px 0 1px 0 rgba(0, 0, 0, 0.15);
  .graph-toolbar {
    position: absolute;
    height: 32px;
    padding: 8px 12px;
    box-sizing: content-box;
    border-radius: 24px;
    left: 50%;
    top: 8%;
    transform: translate(-50%, -50%);
    // background-color: #2d2d2d;
    background-color: #ffffff;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
    z-index: 999;
    button {
      background-color: #eee;
      color: #333;
      // background-color: #3c3c3c;
      box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
      --wave-color: #fff;
      cursor: pointer;
      &:not(:first-child) {
        margin-left: 8px;
      }
      &:not(:disabled):not(.ant-btn-disabled) {
        &:hover
        // &:focus,
        // &:active
        {
          color: #fff;
          border: none;
          outline: none;
          background-color: color.adjust(#3c3c3c, $lightness: 15%);
        }
      }
      .anticon {
        font-size: 14px;
        filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.6));
      }
    }
  }
  .asset-list {
    position: absolute;
    width: 48px;
    padding: 12px 8px;
    border-radius: 4px;
    box-sizing: content-box;
    top: 50%;
    left: 80px;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    button {
      width: 48px;
      height: 48px;
      background-color: #eee;
      color: #333;
      box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
      --wave-color: #fff;
      &:not(:first-child) {
        margin-top: 8px;
      }
      span {
        transform: scale(1.5);
      }
      &:not(:disabled):not(.ant-btn-disabled) {
        &:hover {
          color: #fff;
          border: none;
          outline: none;
          background-color: color.adjust(#3c3c3c, $lightness: 15%);
        }
      }
    }
  }
  .rete-basic-container {
    opacity: 1;
    width: 100%;
    height: 100%;
    transition: opacity 0.4s;
    // &.show {
    //   opacity: 1;
    // }
  }
}

.graph-asset-tooltip {
  pointer-events: none;
}
</style>
