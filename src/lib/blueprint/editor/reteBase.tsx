import { NodeEditor, ClassicPreset, getUID } from "rete"
import { ReactPlugin, Presets, type Position } from "rete-react-plugin"
import { getDOMSocketPosition } from 'rete-render-utils'
import { AreaPlugin, AreaExtensions } from "rete-area-plugin"
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { ConnectionPlugin, Presets as ConnectionPresets, SocketData, Context, getSourceTarget, makeConnection } from "rete-connection-plugin"
import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin'
// import type { Size } from "rete-scopes-plugin/_types/types"
import { DropAddPlugin, NodeScalablePlugin } from './plugin'
// import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin'
// import { structures } from 'rete-structures'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
// import { structures } from 'rete-structures'
import { createRoot } from 'react-dom/client'

import type { Schemes, AreaExtra, MyAreaExtra, StarmapEditorConfig, StarmapGraph, StarmapNode, StarmapConnection, StarmapNodeDefine } from './define'
import { StarmapAbility, StarmapSocketType, Connection, StarmapControlType } from './define'
import { NodeView, ConnectionView, ControlSocket, DataSocket, InputControlView, InputNumberControlView, SelectControlView } from './view'
import { scopeElder, getCreateUniNode, UniNode } from './tool/uniNode'
import { setThemes, computeNodeSizeByDefine, computeGroupSizeByDefine } from './defaultTheme'
import { createTransformer } from './tool/transformer'

const createUniNode = getCreateUniNode({})

export async function createEditor(config: Required<StarmapEditorConfig>) {
  // const _socket = new ClassicPreset.Socket("socket")
  setThemes(config.theme)

  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, MyAreaExtra>(config.container, {
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
    elder: scopeElder
    // size: (_id:string, size:Size) => {
    //   return {
    //     width: Math.max(size.width, groupMiniSize.width),
    //     height: Math.max(size.height, groupMiniSize.height)
    //   }
    // }
  })
  const arrange = new AutoArrangePlugin<Schemes>()
  const dropAdd = new DropAddPlugin<Schemes>(undefined, {
    onNodeAdd: (node:UniNode) => {
      if (config.eventHandlers.onNodeAdd) config.eventHandlers.onNodeAdd(node)

      // if (node.type === 'group') {

      // }
    },
    onNodeRemove: (node:UniNode) => {
      if (config.eventHandlers.onNodeRemove) config.eventHandlers.onNodeRemove(node)

      // if (node.type === 'group') {
        
      // }
    }
  })
  const nodeScale = new NodeScalablePlugin<Schemes>()
  
  arrange.addPreset(ArrangePresets.classic.setup())
  render.addPreset(
    Presets.classic.setup<Schemes, AreaExtra>({
      socketPositionWatcher: getDOMSocketPosition({
        offset: (position, _nodeId, side, _key) => {
          // to do: 是否有闭包导致的内存泄漏风险?
          const node = editor.getNode(_nodeId)
          if (node && node.nest && node.innerMap.includes(_key)) {
            // console.log(node, side, _key)
            return {
              x: position.x + (side === 'output' ? -5 : 5),
              y: position.y
            }
          }
          return {
            x: position.x + (side === 'output' ? 5 : -5),
            y: position.y
          }
        }
      }),
      customize: {
        node(_context) {
          // switch (context.payload.type) {
          //   case 'common': return NodeView
          //   case 'group': return GroupView
          // }
          return NodeView
        },
        socket(context) {
          if (context.payload && context.payload.flowType === StarmapSocketType.CONTROL) return ControlSocket
          return DataSocket
        },
        connection(_context) {
          return function bindConnectionProps(props: { data: Schemes["Connection"] }) {
            return <ConnectionView
              {
                ...props
              }
              click={() => {
                selector.add(
                  {
                    id: props.data.id,
                    label: 'connection',
                    translate() {},
                    unselect() {
                      props.data.selected = false
                      area.update("connection", props.data.id)
                    }
                  },
                  false
                  // accumulating.active()
                )
                props.data.selected = true
                area.update("connection", props.data.id)
              }}
            />
          }
        },
        control(data) {
          switch (data.payload.type) {
            case StarmapControlType.INPUT: return InputControlView
            case StarmapControlType.INPUTNUMBER: return InputNumberControlView
            case StarmapControlType.SELECT: return SelectControlView
            default: return null
          }
        }
      } 
    })
  )
  scopes.addPreset(ScopesPresets.classic.setup())
  connection.addPreset(ConnectionPresets.classic.setup<Schemes>({
    makeConnection: (initial: SocketData, socket: SocketData, context: Context<Schemes, Array<unknown>>) => {
      const source = editor.getNode(initial.nodeId)
      const sourceOutput = source.outputs[initial.key]
      const target = editor.getNode(socket.nodeId)
      const targetInput = target.inputs[socket.key]
      let error = false
      let errorInfo = ''
      if (!sourceOutput || !targetInput) return
      // 更换策略：以前旧的策略是，如果入口和出口类型（包括流类型和数据类型）不同，则自动补全，而事实是这种补全行为非常困难且无效，因此，用户的连线只要是满足入口连出口，即令用户连线成功，但是格式错误会以warning提示，调试报错后转为报错
      if (sourceOutput.socket.flowType !== targetInput.socket.flowType) {
        error = true
        errorInfo = ''
      }
      if (sourceOutput.socket.dataType !== targetInput.socket.dataType) {
        error = true
        errorInfo = ''
      }
      // 定制makeConnection，以返回带有连线类型的连线
      const [sourceSocket, targetSocket] = getSourceTarget(initial, socket) || [null, null]

      if (sourceSocket && targetSocket) {
        context.editor.addConnection({
          id: getUID(),
          source: sourceSocket.nodeId,
          sourceOutput: sourceSocket.key,
          target: targetSocket.nodeId,
          targetInput: targetSocket.key,
          flowType: sourceOutput.socket.flowType,
          dataType: sourceOutput.socket.dataType
        })
        return true
      }
      return makeConnection(initial, socket, context)
    }
  }))

  editor.use(area)
  area.use(connection)
  area.use(render)
  area.use(scopes)
  area.use(arrange)
  area.use(dropAdd)
  area.use(nodeScale)

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
  // let selectNode:(nodeId: string, accumulate: boolean) => void
  // let unselectNode:(nodeId: string) => void
  const selector = new MySelector()
  config.abilities.forEach(([name, _config]) => {
    switch (name) {
      case StarmapAbility.NODE_SELECTABLE: {
        const selectableNodes = AreaExtensions.selectableNodes(area, selector, {
          accumulating: AreaExtensions.accumulateOnCtrl()
        })
        // selectNode = selectableNodes.select
        // unselectNode = selectableNodes.unselect
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
        // const { width, height } = nodeData.nest ? computeGroupSizeByDefine(nodeData.category, nodeData.nest) : computeNodeSizeByDefine(nodeData.category)
        const node = createUniNode({
          id: nodeData.id,
          label: nodeData.label,
          name: nodeData.name,
          type: nodeData.nest ? 'group' : 'common', 
          theme: nodeData.theme,
          parent: nodeData.parent,
          // width: nodeData.width,
          // height: nodeData.height,
          width: nodeData.width,
          height: nodeData.height,
          nest: nodeData.nest,
          category: nodeData.category || []
        })
        await editor.addNode(node)
        await area.translate(nodeData.id, nodeData.position)
      }
      for (const connectionData of data.connections) {
        const connection = new Connection(
          editor.getNode(connectionData.source),
          connectionData.sourceOutput,
          editor.getNode(connectionData.target),
          connectionData.targetInput
        )
        connection.flowType = connectionData.flowType
        connection.dataType = connectionData.dataType
        await editor.addConnection(connection)
      }
      await area.area.zoom(data.transform.scale)
      await area.area.translate(data.transform.x, data.transform.y)
    },
    export: () => {
      // console.log('nodes', editor.getNodes())
      // console.log('connections', editor.getConnections())
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
            parent: node.parent,
            nest: node.nest, // 可否成为容器节点
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
          sourceOutput: connection.sourceOutput,
          target: connection.target,
          targetInput: connection.targetInput,
          flowType: connection.flowType,
          dataType: connection.dataType
        }))
      } as StarmapGraph<StarmapNode, StarmapConnection>
    },
    dropAdd: (item:StarmapNodeDefine|null) => {
      if (item) {
        dropAdd.add(() => {
          const { width, height } = item.nest ? computeGroupSizeByDefine(item.category, item.nest) : computeNodeSizeByDefine(item.category)
          return createUniNode({
            id: item?.id,
            name: item.name,
            label: item.label,
            type: item.nest ? 'group' : 'common', 
            theme: item.theme,
            width,
            height,
            nest: item.nest,
            category: item.category || []
          })
        })
      } else dropAdd.remove()
    },
    deleteSelect: async () => {
      selector.entities.forEach(async (entity) => {
        switch (entity.label) {
          case 'connection': {
            await editor.removeConnection(entity.id)
            break
          }
          case 'node': {
            const connections = editor.getConnections().filter(c => {
              return c.source === entity.id || c.target === entity.id
            })
            for (const connection of connections) {
              await editor.removeConnection(connection.id)
            }
            await editor.removeNode(entity.id)
            break
          }
        }
      })
    }
  }
}