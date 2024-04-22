<template>
  <div class="rete-basic">
    <div class="rete-details">基础编辑器，有一些简单的功能</div>
    <div class="rete-functions"><button @click="handleFitContent">窗口适配</button></div>
    <div class="rete-basic-container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { NodeEditor, type GetSchemes, ClassicPreset } from 'rete'
import { VuePlugin, type VueArea2D, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'

export default defineComponent({
  name: 'ReteBasic',
  setup() {
    const containerRef:Ref<HTMLElement|undefined> = ref(undefined)

    // 定义了加入可加入的Scheme（你可以理解为Node + Connection）
    type Schemes = GetSchemes<
      ClassicPreset.Node,
      ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
    >
    // 如果说scheme是在定义node和connection的model，areaExtra就是在定义对应的自定义view
    type AreaExtra = VueArea2D<Schemes>

    const editor = new NodeEditor<Schemes>()
    let area:AreaPlugin<Schemes, AreaExtra>
    const render = new VuePlugin<Schemes, AreaExtra>()
    // 向渲染器中注入基本的节点、连接的视图模板
    render.addPreset(Presets.classic.setup())

    const connection = new ConnectionPlugin<Schemes, AreaExtra>()
    connection.addPreset(ConnectionPresets.classic.setup())

    onMounted(async () => {
      if (containerRef.value) {
        area = new AreaPlugin<Schemes, AreaExtra>(containerRef.value)

        editor.use(area)
        area.use(render)
        area.use(connection)

        AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
          // accumulating: { active() { return false} }
          accumulating: AreaExtensions.accumulateOnCtrl()
        })

        AreaExtensions.simpleNodesOrder(area)

        // 这里的socket并不是webSocket的那个socket，而是指连接点（捏可以认为是节点上附带的一个可以用于连接连线的点）
        const socket = new ClassicPreset.Socket('socket')

        const nodeA = new ClassicPreset.Node('A')
        // 向nodeA上添加了一个文本类型控件
        nodeA.addControl('a', new ClassicPreset.InputControl('text', {}))
        // 向nodeA上添加了一个带有连接点的出口
        nodeA.addOutput('a', new ClassicPreset.Output(socket))
        // 向画布中添加了nodeA
        await editor.addNode(nodeA)

        const nodeB = new ClassicPreset.Node('B')
        nodeB.addControl('b', new ClassicPreset.InputControl('text', {}))
        nodeB.addInput('b', new ClassicPreset.Input(socket))
        await editor.addNode(nodeB)
        await area.translate(nodeB.id, { x: 270, y: 0 })
      }
    })
  
    const handleFitContent = () => {
      if (area) AreaExtensions.zoomAt(area, editor.getNodes())
    }

    return {
      containerRef,
      handleFitContent
    }
  }
})
</script>

<style lang="scss">
.rete-basic{
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
  .rete-basic-container{
    width: 100%;
    height: calc(100% - 61px);
  }
}
</style>