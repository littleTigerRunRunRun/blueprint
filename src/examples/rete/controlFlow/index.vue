<template>
  <div class="rete-dataflow">
    <div class="rete-details">控制流示例</div>
    <div class="rete-functions"></div>
    <div class="rete-dataflow-container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { message } from "ant-design-vue"
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { createEditor } from './basic/editor'

export default defineComponent({
  name: 'ReteDataflow',
  setup() {
    const containerRef:Ref<HTMLElement|undefined> = ref(undefined)

    // 向渲染器中注入基本的节点、连接的视图模板

    onMounted(async () => {
      if (containerRef.value) createEditor(containerRef.value, message.info)
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