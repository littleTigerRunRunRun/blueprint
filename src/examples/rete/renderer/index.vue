<template>
  <div class="rete-renderer">
    <div class="rete-details">根据对应的视图渲染器定制样式</div>
    <div class="rete-functions"></div>
    <div class="rete-renderer-container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { createEditor } from './editor'

export default defineComponent({
  name: 'ReteRenderer',
  setup() {
    const containerRef:Ref<HTMLElement|undefined> = ref(undefined)

    // 向渲染器中注入基本的节点、连接的视图模板

    onMounted(async () => {
      if (containerRef.value) createEditor(containerRef.value)
    })

    return {
      containerRef
    }
  }
})
</script>

<style lang="scss">
.rete-renderer{
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
  .rete-renderer-container{
    width: 100%;
    height: calc(100% - 61px);
  }
}
</style>