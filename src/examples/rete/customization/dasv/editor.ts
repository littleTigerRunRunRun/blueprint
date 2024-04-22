import { NodeEditor, type GetSchemes, ClassicPreset } from "rete"
import { AreaPlugin, AreaExtensions } from "rete-area-plugin"
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin"
import { VuePlugin, Presets, type VueArea2D } from "rete-vue-plugin"
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { getDOMSocketPosition } from 'rete-render-utils'
import CustomNode from "./view/node.vue"
import CustomConnection from "./view/connection.vue"
import CustomSocket from "./view/socket.vue"

class SizeNode extends ClassicPreset.Node {
  width?: number
  height?: number
  constructor(label: string, width?: number, height?: number) {
    super(label)
    this.width = width
    this.height = height
  }
}

type Schemes = GetSchemes<
  SizeNode,
  ClassicPreset.Connection<SizeNode, SizeNode>
>
type AreaExtra = VueArea2D<Schemes>

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket")

  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new VuePlugin<Schemes, AreaExtra>()

  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add(entity:E, accumulate:boolean):void {
      super.add(entity, accumulate)
      // console.log('added', entity)
      // 更新数据尝试
      const node = editor.getNode(entity.id)
      node.label = '修改标题'
      area.update('node', entity.id)
    }
  
    remove(entity: E):void {
      super.remove(entity)
      // console.log('removed', entity)
    }
  }

  AreaExtensions.selectableNodes(area, new MySelector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  })

  render.addPreset(
    Presets.classic.setup({
      socketPositionWatcher: getDOMSocketPosition({
        offset: (position, nodeId, side, key) => {
          return {
            x: position.x,
            y: position.y
          }
        }
      }),
      customize: {
        node(context) {
          return CustomNode
        },
        socket(context) {
          return CustomSocket
        },
        connection(context) {
          return CustomConnection
        }
      }
    })
  )

  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(render)

  AreaExtensions.simpleNodesOrder(area)

  const a = new SizeNode("自定义节点", 150, 177)
  a.addOutput("onVisibleSwitch", new ClassicPreset.Output(socket, '切换显隐'))
  a.addInput("hide", new ClassicPreset.Input(socket, '隐藏'))
  a.addInput("show", new ClassicPreset.Input(socket, '显示'))
  await editor.addNode(a)

  const b = new SizeNode("自定义节点", 150, 177)
  b.addOutput("onVisibleSwitch", new ClassicPreset.Output(socket, '切换显隐'))
  b.addInput("hide", new ClassicPreset.Input(socket, '隐藏'))
  b.addInput("show", new ClassicPreset.Input(socket, '显示'))
  await editor.addNode(b)

  await area.translate(b.id, { x: 320, y: 0 })

  await editor.addConnection(new ClassicPreset.Connection(a, "onVisibleSwitch", b, "hide"))

  AreaExtensions.zoomAt(area, editor.getNodes())

  return () => area.destroy()
}