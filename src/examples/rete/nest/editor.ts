import { NodeEditor, type GetSchemes, ClassicPreset } from "rete"
import { AreaPlugin, AreaExtensions } from "rete-area-plugin"
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin"
import { VuePlugin, Presets, type VueArea2D } from "rete-vue-plugin"
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { getDOMSocketPosition } from 'rete-render-utils'
import { ScopesPlugin, Presets as ScopesPresets } from '@/lib/rete-extend/rete-scopes-plugin'
// import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin'
import { structures } from 'rete-structures'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import CustomNode from "./view/node.vue"
import CustomConnection from "./view/connection.vue"
import CustomSocket from "./view/socket.vue"
import CustomGroup from './view/group.vue'
import { UniNode, getCreateUniNode, scopeElder } from '../lib/uniNode/0.0.2'
import type { Size } from "rete-scopes-plugin/_types/types"

type Node = UniNode<'text'|'number', string|number>

class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> {}

type Schemes = GetSchemes<
  Node,
  Connection<Node, Node>
>
type AreaExtra = VueArea2D<Schemes>

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket")
  const groupMiniSize = { width: 190, height: 150 }

  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new VuePlugin<Schemes, AreaExtra>()
  const scopes = new ScopesPlugin<Schemes>({
    elder: scopeElder,
    size: (id:string, size:Size) => {
      return {
        width: Math.max(size.width, groupMiniSize.width),
        height: Math.max(size.height, groupMiniSize.height)
      }
    }
  })
  const arrange = new AutoArrangePlugin<Schemes>()

  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add(entity:E, accumulate:boolean):void {
      super.add(entity, accumulate)
      // console.log('added', entity)
      // 更新数据尝试
      // const node = editor.getNode(entity.id)
      // node.label = '修改标题'
      // area.update('node', entity.id)
    }
  
    remove(entity: E):void {
      super.remove(entity)
      // console.log('removed', entity)
    }
  }

  const createUniNode = getCreateUniNode<'text'|'number', string|number>({})

  const createSizeNode = () => {
    return createUniNode({
      label: '自定义节点',
      type: 'common',
      width: 150,
      height: 177,
      inputs: {
        hide: { label: '隐藏' },
        show: { label: '显示' }
      },
      outputs: {
        onVisibleSwitch: { label: '切换显隐' }
      },
      controls: {}
    })
  }

  const createGroup = () => {
    return createUniNode({
      label: '分组',
      type: 'group',
      hasChildren: true,
      width: groupMiniSize.width,
      height: groupMiniSize.height,
      inputs: {},
      outputs: {},
      controls: {}
    })
  }

  AreaExtensions.selectableNodes(area, new MySelector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  })
  
  arrange.addPreset(ArrangePresets.classic.setup())

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
          switch (context.payload.type) {
            case 'common': return CustomNode
            case 'group': return CustomGroup
          }
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

  scopes.addPreset(ScopesPresets.classic.setup())

  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(render)
  area.use(scopes)
  area.use(arrange)

  // AreaExtensions.simpleNodesOrder(area)

  const a = createSizeNode()
  await editor.addNode(a)

  const b = createSizeNode()
  await editor.addNode(b)

  const group = createGroup()
  await editor.addNode(group)

  await area.translate(b.id, { x: 320, y: 0 })

  await editor.addConnection(new ClassicPreset.Connection(a, "onVisibleSwitch", b, "hide"))

  await arrange.layout()
  AreaExtensions.zoomAt(area, editor.getNodes())

  const graph = structures(editor)
  console.log('graph', graph)

  function exportData() {
    return {
      // nodes: editor.getNodes().map(n => n.serialize()),
      // connections: editor.getConnections().map(c => c.serialize()),
    }
  }

  return {
    destroy: () => area.destroy(),
    export: exportData
  }
}