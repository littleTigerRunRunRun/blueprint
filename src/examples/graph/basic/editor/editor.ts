import { NodeEditor, type GetSchemes, ClassicPreset, getUID } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { VuePlugin, Presets, type VueArea2D } from 'rete-vue-plugin'
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { getDOMSocketPosition } from 'rete-render-utils'
import { ScopesPlugin, Presets as ScopesPresets } from '@/lib/rete-extend/rete-scopes-plugin'
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
  type SocketData,
  type Context,
  getSourceTarget,
  makeConnection
} from 'rete-connection-plugin'

import { structures } from 'rete-structures'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import NodeView from './view/node.vue'
import StartNodeView from './view/node-start.vue'
import EndNodeView from './view/node-end.vue'
import CustomConnection from './view/connection.vue'
import CustomSocket from './view/socket.vue'
import CustomGroup from './view/group.vue'
import type { Size } from 'rete-scopes-plugin/_types/types'

import { UniNode, scopeElder, getCreateUniNode } from './uniNode'
import { DropAddPlugin, NodeScalablePlugin } from './plugin'
import type {
  Schemes,
  MyAreaExtra,
  DataFlowNode,
  DataFlowGraph,
  GraphEditor,
  EditorInitParams
} from './define'
import { GraphAbility } from './define'

const createNode = getCreateUniNode({})

export async function createEditor(params: EditorInitParams): Promise<GraphEditor> {
  let id
  const { container, abilities, eventHandlers } = params

  // 核心
  const editor = new NodeEditor<Schemes>()

  // 拖拽、缩放等画布功能插件
  const area = new AreaPlugin<Schemes, MyAreaExtra>(container, {
    zoom: {
      dblclick: (_delta) => 0
    },
    move: {
      limit: (x, y, id) => {
        const node = editor.getNode(id)

        const nodeView = area.nodeViews.get(id)

        if (!node?.parent || !nodeView) return { x, y }

        const parent = editor.getNode(node.parent)
        const parentView = area.nodeViews.get(node.parent)

        const result = { x, y }
        // const border = parseFloat(getThemes().node.style.main.groupBorder)
        // if (x < parentView!.position.x + border) result.x = parentView!.position.x + border
        // if (x + node.width > parentView!.position.x + parent!.width - border) result.x = parentView!.position.x + parent!.width - border - node.width
        // if (y < parentView!.position.y + (parent!.outerHeight || 0)) result.y = parentView!.position.y + (parent!.outerHeight || 0)
        // if (y + node.height > parentView!.position.y + parent!.height - border) result.y = parentView!.position.y + parent!.height - border - node.height

        return result
      }
    }
  })

  // 连线插件
  const connection = new ConnectionPlugin<Schemes, MyAreaExtra>({
    canMakePreudo(socketData: SocketData): boolean {
      // console.log(socketData.side)
      if (socketData.side === 'input') return false
      return true
    }
  })

  // 渲染插件
  const render = new VuePlugin<Schemes, MyAreaExtra>()

  // 支持父子组件嵌套的插件
  const scopes = new ScopesPlugin<Schemes>({
    elder: scopeElder
    // size: (_id:string, size:Size) => {
    //   return {
    //     width: Math.max(size.width, groupMiniSize.width),
    //     height: Math.max(size.height, groupMiniSize.height)
    //   }
    // }
  })

  // 自动布局插件
  const arrange = new AutoArrangePlugin<Schemes>()

  // 节点拖拽加入插件（自研）
  const dropAdd = new DropAddPlugin<Schemes>(undefined, {
    onNodeAdd: (node: UniNode) => {
      // if (config.eventHandlers.onNodeAdd) config.eventHandlers.onNodeAdd(node);
      // if (node.type === 'group') {
      // }
    },
    onNodeRemove: (node: UniNode) => {
      // if (config.eventHandlers.onNodeRemove)
      //   config.eventHandlers.onNodeRemove(node);
      // if (node.type === 'group') {
      // }
    }
  })

  // 节点支持缩放插件（自研）
  const nodeScale = new NodeScalablePlugin<Schemes>()

  // 插件安装
  arrange.addPreset(ArrangePresets.classic.setup())

  render.addPreset(
    // setup<Schemes, MyAreaExtra>
    Presets.classic.setup({
      socketPositionWatcher: getDOMSocketPosition({
        offset: (position, _nodeId, side, _key) => {
          // to do: 是否有闭包导致的内存泄漏风险?
          // const node = editor.getNode(_nodeId)
          // if (node && node.nest && node.innerMap.includes(_key)) {
          //   // console.log(node, side, _key)
          //   return {
          //     x: position.x + (side === 'output' ? -5 : 5),
          //     y: position.y
          //   }
          // }
          return {
            x: position.x + (side === 'output' ? 5 : -5),
            y: position.y
          }
        }
      }),
      customize: {
        node(context) {
          console.log(context)
          switch (context.payload.name) {
            case 'node':
              return NodeView
            case 'start':
              return StartNodeView
            case 'end':
              return EndNodeView
          }
        },
        socket(context) {
          // if (
          //   context.payload &&
          //   context.payload.flowType === StarmapSocketType.CONTROL
          // )
          //   return ControlSocket;
          // return DataSocket;
          return CustomSocket
        },
        connection(_context) {
          return CustomConnection
        }
        // control(data) {
        //   switch (data.payload.type) {
        //     case StarmapControlType.INPUT:
        //       return InputControlView;
        //     case StarmapControlType.INPUTNUMBER:
        //       return InputNumberControlView;
        //     case StarmapControlType.SELECT:
        //       return SelectControlView;
        //     case StarmapControlType.CODE:
        //       return CodeControlView;
        //     default:
        //       return null;
        //   }
        // },
      }
    })
  )
  scopes.addPreset(ScopesPresets.classic.setup())
  connection.addPreset(
    ConnectionPresets.classic
      .setup
      // { makeConnection: () => true } // 定制连线校验规则
      ()
  )

  // 链接各个插件的通信
  editor.use(area)
  area.use(connection)
  area.use(render)
  area.use(scopes)
  area.use(arrange)
  area.use(dropAdd)
  area.use(nodeScale)

  // 能力注册：
  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add(entity: E, accumulate: boolean): void {
      super.add(entity, accumulate)

      if (eventHandlers?.onNodeSelected)
        eventHandlers.onNodeSelected({
          node: editor.getNode(entity.id) as UniNode,
          ...entity
        })
    }

    remove(entity: E): void {
      super.remove(entity)

      if (eventHandlers?.onNodeUnselected)
        eventHandlers.onNodeUnselected({
          node: editor.getNode(entity.id) as UniNode,
          ...entity
        })
    }
  }
  // let selectNode:(nodeId: string, accumulate: boolean) => void
  // let unselectNode:(nodeId: string) => void
  const selector = new MySelector()
  abilities.forEach((abl) => {
    switch (abl) {
      case GraphAbility.NODE_SELECTABLE: {
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

  return {
    clear: async () => {
      // 清空内容
      await editor.clear()
      // 归零内容
      area.area.transform.k = 1
      area.area.transform.x = 0
      area.area.transform.y = 0
      await area.area.zoom(1, 0, 0)
    },
    import(data: DataFlowGraph) {},
    export() {
      const nodes: Array<UniNode> = editor.getNodes()
      const transform = area.area.transform
      return {
        id: id || getUID(),
        transform: {
          x: transform.x,
          y: transform.y,
          scale: transform.k
        },
        nodes: nodes.map((node) => {
          const view = area.nodeViews.get(node.id)
          if (!view) throw new Error(`no node view when export data:${node.id}`)
          console.log(view)
          return {
            id: node.id,
            name: node.name,
            label: node.label,
            width: node.width,
            height: node.height,
            position: view.position
          }
        }),
        lines: []
        // connections: editor.getConnections().map((connection) => ({
        //   source: connection.source,
        //   sourceOutput: connection.sourceOutput,
        //   target: connection.target,
        //   targetInput: connection.targetInput,
        //   flowType: connection.flowType,
        //   dataType: connection.dataType,
        // })),
      }
    },
    dropAdd: (item: DataFlowNode | null) => {
      if (item) {
        dropAdd.add(() => {
          return createNode({
            id: item?.id,
            name: item.name,
            label: item.label,
            width: item.width,
            height: item.height
          })
        })
      } else dropAdd.remove()
    },
    // deleteSelect: async () => {
    //   selector.entities.forEach(async (entity) => {
    //     switch (entity.label) {
    //       case "connection": {
    //         await editor.removeConnection(entity.id);
    //         break;
    //       }
    //       case "node": {
    //         const connections = editor.getConnections().filter((c) => {
    //           return c.source === entity.id || c.target === entity.id;
    //         });
    //         for (const connection of connections) {
    //           await editor.removeConnection(connection.id);
    //         }
    //         await editor.removeNode(entity.id);
    //         break;
    //       }
    //     }
    //   });
    // },
    destroy() {
      editor.clear()
      dropAdd.destroy()
      area.destroy()
    },
    deleteSelect() {}
  }
}
