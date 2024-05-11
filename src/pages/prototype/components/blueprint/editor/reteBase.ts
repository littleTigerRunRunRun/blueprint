import { NodeEditor, ClassicPreset } from "rete"
import { ReactPlugin, Presets } from "rete-react-plugin"
import { getDOMSocketPosition } from 'rete-render-utils'
import { AreaPlugin, AreaExtensions } from "rete-area-plugin"
import { type SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { ConnectionPlugin, Presets as ConnectionPresets, SocketData } from "rete-connection-plugin"
import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin'
import type { Size } from "rete-scopes-plugin/_types/types"
import { DropAddPlugin} from './drop-add-plugin'
// import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin'
// import { structures } from 'rete-structures'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
// import { structures } from 'rete-structures'
import { createRoot } from 'react-dom/client'

import type { Schemes, AreaExtra, StarmapEditorConfig, StarmapGraph, StarmapNode, StarmapConnection, StarmapNodeDefine, StarmapTheme } from './define'
import { StarmapAbility, StarmapDataType } from './define'
import { NodeView, GroupView, ConnectionView, SocketView } from './view'
import { scopeElder, getCreateUniNode, UniNode } from './uniNode'
import { setThemes, computeNodeSizeByDefine } from './defaultTheme'

const groupMiniSize = { width: 190, height: 150 }
const createUniNode = getCreateUniNode({})
// const createSizeNode = () => {
//   return createUniNode({
//     label: '自定义节点',
//     type: 'common',
//     width: 150,
//     height: 177,
//     inputs: {
//       hide: { label: '隐藏' },
//       show: { label: '显示' }
//     },
//     outputs: {
//       onVisibleSwitch: { label: '切换显隐' }
//     },
//     controls: {}
//   })
// }
// const createGroup = () => {
//   return createUniNode({
//     label: '分组',
//     type: 'group',
//     hasChildren: true,
//     width: groupMiniSize.width,
//     height: groupMiniSize.height,
//     inputs: {},
//     outputs: {},
//     controls: {}
//   })
// }

export async function createEditor(config: Required<StarmapEditorConfig>) {
  // const _socket = new ClassicPreset.Socket("socket")
  setThemes(config.theme)

  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(config.container, {
    zoom: {
      dblclick: (_delta) => 0
    }
  })
  const connection = new ConnectionPlugin<Schemes, AreaExtra>({
    canMakePreudo(socketData:SocketData):boolean {
      // console.log(socketData.side)
      if (socketData.side === 'input') return false
      return true
    }
  })
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot })
  const scopes = new ScopesPlugin<Schemes>({
    elder: scopeElder,
    size: (_id:string, size:Size) => {
      return {
        width: Math.max(size.width, groupMiniSize.width),
        height: Math.max(size.height, groupMiniSize.height)
      }
    }
  })
  const arrange = new AutoArrangePlugin<Schemes>()
  const dropAdd = new DropAddPlugin<Schemes>(undefined, {
    onNodeAdd: config.eventHandlers.onNodeAdd,
    onNodeRemove: config.eventHandlers.onNodeRemove
  })
  
  arrange.addPreset(ArrangePresets.classic.setup())
  render.addPreset(
    Presets.classic.setup({
      socketPositionWatcher: getDOMSocketPosition({
        offset: (position, _nodeId, side, _key) => {
          return {
            x: position.x + (side === 'output' ? 5 : -5),
            y: position.y
          }
        }
      }),
      customize: {
        node(context) {
          switch (context.payload.type) {
            case 'common': return NodeView
            case 'group': return GroupView
          }
          return NodeView
        },
        socket(_context) {
          return SocketView
        },
        connection(_context) {
          return ConnectionView
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
  area.use(dropAdd)

  // 能力注册：
  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add(entity:E, accumulate:boolean):void {
      super.add(entity, accumulate)
      
      if (config.eventHandlers?.onNodeSelected) config.eventHandlers?.onNodeSelected({
        node: editor.getNode(entity.id),
        ...entity
      })
    }
  
    remove(entity: E):void {
      super.remove(entity)
      
      if (config.eventHandlers?.onNodeUnselected) config.eventHandlers?.onNodeUnselected({
        node: editor.getNode(entity.id),
        ...entity
      })
    }
  }
  let selectNode:(nodeId: string, accumulate: boolean) => void
  let unselectNode:(nodeId: string) => void
  const selector = new MySelector()
  config.abilities.forEach(([name, _config]) => {
    switch (name) {
      case StarmapAbility.NODE_SELECTABLE: {
        const selectableNodes = AreaExtensions.selectableNodes(area, selector, {
          accumulating: AreaExtensions.accumulateOnCtrl()
        })
        selectNode = selectableNodes.select
        unselectNode = selectableNodes.unselect
        dropAdd.getSelectHanlder({
          select: selectableNodes.select,
          unselect: selectableNodes.unselect
        })
        break
      }
    }
  })

  // await arrange.layout()
  // AreaExtensions.zoomAt(area, editor.getNodes())

  return {
    destroy: () => {
      dropAdd.destroy()
      area.destroy()
    },
    clear: async () => {
      // 清空内容
      await editor.clear()
      // 归零内容
      area.area.transform.k = 1
      area.area.transform.x = 0
      area.area.transform.y = 0
      await area.area.zoom(1, 0, 0)
    },
    import: async (data:StarmapGraph<StarmapNode, StarmapConnection>) => {
      // console.log('import data', data)
      // 清空内容
      await editor.clear()
      // 归零内容
      area.area.transform.k = 1
      area.area.transform.x = 0
      area.area.transform.y = 0

      // to do:根据节点间的父子级关系分顺序加入节点
      for (const nodeData of data.nodes) {
        const node = createUniNode({
          id: nodeData.id,
          label: nodeData.label,
          name: nodeData.name,
          type: 'common',
          theme: nodeData.theme,
          width: nodeData.width,
          height: nodeData.height,
          category: nodeData.category || []
        })
        await editor.addNode(node)
        await area.translate(nodeData.id, nodeData.position)
      }
      for (const connectionData of data.connections) {
        await editor.addConnection(new ClassicPreset.Connection(
          editor.getNode(connectionData.source),
          connectionData.sourceOutput,
          editor.getNode(connectionData.target),
          connectionData.targetInput
        ))
      }
      await area.area.zoom(data.transform.scale, data.transform.x, data.transform.y)
    },
    export: () => {
      console.log('nodes', editor.getNodes())
      console.log('connections', editor.getConnections())
      // console.log('transform', area.area.transform)
      const nodes:Array<UniNode> = editor.getNodes()
      const transform = area.area.transform
      return {
        transform: {
          x: transform.x,
          y: transform.y,
          scale: transform.k
        },
        nodes: nodes.map((node) => {
          const view = area.nodeViews.get(node.id)
          if (!view) throw new Error(`no node view when export data:${node.id}`)
          return {
            id: node.id,
            name: node.name,
            theme: node.theme,
            width: node.width,
            height: node.height,
            // parent?: string
            // nest?: NestConfig // 可否成为容器节点
            // children?: Array<NodeId>
            position: view?.position,
            label: node.label,
            category: node.category,
            status: {
              error: false
            }
          }
        }),
        connections: editor.getConnections().map((connection) => ({
          source: connection.source,
          sourceOutput: connection.sourceOutput.split('_')[2],
          target: connection.target,
          targetInput: connection.targetInput.split('_')[2]
        }))
      } as StarmapGraph<StarmapNode, StarmapConnection>
    },
    dropAdd: (item:StarmapNodeDefine|null) => {
      if (item) {
        dropAdd.add(() => {
          const { width, height } = computeNodeSizeByDefine(item.category)
          return createUniNode({
            id: item?.id,
            name: item.name,
            label: item.label,
            type: 'common',
            theme: item.theme,
            width,
            height,
            category: item.category || []
          })
        })
      } else dropAdd.remove()
    },
    deleteSelect: async () => {
      selector.entities.forEach(async (entity) => {
        await editor?.removeNode(entity.id)
      })
    }
  }
}