<template>
  <div class="rete-dataflow">
    <div class="rete-details">控制流示例</div>
    <div class="rete-functions"></div>
    <div class="rete-dataflow-container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { message } from "ant-design-vue"
import { defineComponent, onMounted, onUnmounted, ref, Ref } from 'vue'
// import { createEditor } from './uniDataFlow/editor' // 使用统一节点开发的数据流示例
// import { createEditor } from './uniControlFlow/editor' // 使用统一节点开发的控制流示例
import { createEditor } from './uniHybrid/editor' // 使用统一节点开发的混合流示例

export default defineComponent({
  name: 'ReteDataflow',
  setup() {
    const containerRef:Ref<HTMLElement|undefined> = ref(undefined)
    let editor = { destroy: () => {} }

    // 向渲染器中注入基本的节点、连接的视图模板

    onMounted(async () => {
      if (containerRef.value) editor = await createEditor(containerRef.value, message.info)
    })

    onUnmounted(() => {
      if (editor) editor.destroy()
    })

    return {
      containerRef
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
    width: 100%;
    height: calc(100% - 61px);
  }
}
</style>