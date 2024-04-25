<template>
  <div class="rete-dataflow">
    <div class="rete-details">自定义样式</div>
    <div class="rete-functions"><button @click="exportData">导出数据</button></div>
    <div class="rete-dataflow-container" ref="containerRef">
      <div class="customized-background" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
// import { createEditor } from './basic/editor' // retejs基础示例
import { createEditor } from './editor' // dasv风格练手示例

export default defineComponent({
  name: 'ReteDataflow',
  setup() {
    const containerRef:Ref<HTMLElement|undefined> = ref(undefined)

    // 向渲染器中注入基本的节点、连接的视图模板
    let editor:any

    onMounted(async () => {
      if (containerRef.value) editor = await createEditor(containerRef.value)
    })

    const exportData = () => {
      if (editor) console.log(editor.export())
    }

    return {
      containerRef,
      exportData
    }
  }
})
</script>

<style lang="scss">
.rete-dataflow{
  width: 100%;
  height: 100%;
  .rete-details {
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #ccc;
  }
  .rete-functions {
    width: 100%;
    height: 30px;
  }
  .rete-dataflow-container{
    position: relative;
    width: 100%;
    height: calc(100% - 61px);
    .customized-background {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      background: #333;
      background-image: radial-gradient(circle at center, #555 1px, transparent 2px);
      background-size: 24px 24px;
    }
  }
}
</style>