// rete 插件体系引用
import { NodeEditor, getUID } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { getDOMSocketPosition } from 'rete-render-utils'
import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin' // , type Size
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
  type SocketData,
  type Context,
  getSourceTarget,
  makeConnection
} from 'rete-connection-plugin'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { structures } from 'rete-structures'

// 视图优化
import NodeIntervalContainer from './view/node-interval-container.vue'
import CustomConnection from './view/connection.vue'
import CustomSocket from './view/socket.vue'
import CustomGroup from './view/group.vue'

// 自研工具引用
import { UniNode, scopeElder, getCreateUniNode } from './tool/uniNode'
import { attachSmoothArea } from "./tool/smoothZoom";
import { DropAddPlugin, NodeScalablePlugin } from './plugin'
import { global } from './global'
const createNode = getCreateUniNode({})

// 业务定义
import type {
  Schemes,
  MyAreaExtra,
  RawDataFlowNode,
  DataFlowGraph,
  GraphEditor,
  EditorInitParams
} from './define'
import { GraphAbility, Connection } from './define'
import { CMItems } from './tool/contextmenu'

// 画布生成主程序
export async function createEditor(params: EditorInitParams): Promise<GraphEditor> {
  let id = params.id || getUID()
  const { container, abilities, eventHandlers } = params

  // 编辑器核心
  const editor = new NodeEditor<Schemes>()

  // 拖拽、缩放等画布功能插件
  const area = new AreaPlugin<Schemes, MyAreaExtra>(container, {
    move: {
      limit: (x, y, id) => {
        const node = editor.getNode(id)

        const nodeView = area.nodeViews.get(id)

        if (!node?.parent || !nodeView) return { x, y }

        const _parent = editor.getNode(node.parent)
        const _parentView = area.nodeViews.get(node.parent)

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
  // 顺滑area缩放
  attachSmoothArea(area)

  // 连线插件
  // {
  //   canMakePreudo(socketData: SocketData): boolean {
  //     // console.log(socketData.side)
  //     if (socketData.side === 'input') return false
  //     return true
  //   }
  // }
  const connection = new ConnectionPlugin<Schemes, MyAreaExtra>({
    canMakePreudo(socketData: SocketData): boolean {
      // if (socketData.side === "input") return false;
      return true;
    },
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
  
  // 右键菜单插件
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: CMItems,
    birthFilter: (x: number, y: number) => {
      return {
        x: x - 5,
        y: y - 2
      }
    }
  }) as any

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

  // 注册视图
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
            x: position.x - 5,
            y: position.y - 5
          }
        }
      }),
      customize: {
        node(_context) {
          return NodeIntervalContainer
          // switch (context.payload.name) {
          //   case 'node':
          //     return NodeView
          //   case 'start':
          //     return StartNodeView
          //   case 'end':
          //     return EndNodeView
          // }
        },
        socket(_context) {
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
        },
        // main(_context) {
        //   return 
        // }
        // item: () => UI.ContextMenu.Item as any,
        // common: () => UI.ContextMenu.Common as any,
        // search: () => UI.ContextMenu.Search as any,
        // subitems: () => UI.ContextMenu.Subitems as any
      }
    })
  )
  render.addPreset(Presets.contextMenu.setup({ delay: 400, className: 'graph-context-menu' }) as any)
  scopes.addPreset(ScopesPresets.classic.setup())
  connection.addPreset(ConnectionPresets.classic.setup())
  // { makeConnection: () => true } // 定制连线校验规则

  // 监听事件提供线型修改中间函数
  render.addPipe((context:any) => {
    if (context.type === 'connectionpath') {
      const points = context.data.points
      // const centerPoint = [
      //   points[0].x,
      //   points[1].y
      // ]
      const centerPoint1 = [
        (points[0].x + points[1].x) * 0.5,
        points[0].y
      ]
      const centerPoint2 = [
        (points[0].x + points[1].x) * 0.5,
        points[1].y
      ]
      const path = `M${points[0].x},${points[0].y} L${centerPoint1[0]},${centerPoint1[1]} L${centerPoint2[0]},${centerPoint2[1]} L${points[1].x},${points[1].y}`
      return {
        data: {
          points,
          path
        }
      }
    }
    return context
  })

  // 链接各个插件的通信
  editor.use(area)
  area.use(connection)
  area.use(contextMenu)
  area.use(render)
  area.use(scopes)
  area.use(arrange)
  area.use(dropAdd)
  area.use(nodeScale)

  // 能力注册：
  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add = async (entity: E, accumulate: boolean) => {
      super.add(entity, accumulate)

      if (eventHandlers?.onNodeSelected)
        eventHandlers.onNodeSelected({
          node: editor.getNode(entity.id) as UniNode,
          ...entity
        })
    }
    remove = async (entity: E) => {
      super.remove(entity)

      if (eventHandlers?.onNodeUnselected)
        eventHandlers.onNodeUnselected({
          node: editor.getNode(entity.id) as UniNode,
          ...entity
        })
    }
  }
  
  // 用户自定义能力注册
  const selector = new MySelector()
  const accumulating = AreaExtensions.accumulateOnCtrl()
  global.connectionSelector = {
    area,
    selector,
    accumulating
  }
  abilities.forEach((abl) => {
    switch (abl) {
      // 可选中节点
      case GraphAbility.NODE_SELECTABLE: {
        const selectableNodes = AreaExtensions.selectableNodes(area, selector, { accumulating })
        global.connectionSelector.selectableNodes = selectableNodes
        dropAdd.getSelectHanlder({
          select: selectableNodes.select,
          unselect: selectableNodes.unselect
        })
        break
      }
    }
  })

  // 返回各种回调函数
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
    import: async (data: DataFlowGraph) => {
      id = data.id
      // 清空画布
      await editor.clear()
      // 归零内容
      area.area.transform.k = 1
      area.area.transform.x = 0
      area.area.transform.y = 0

      // nd = nodeData
      for (const nd of data.nodes) {
        const node = createNode({
          id: nd.id,
          name: nd.name,
          label: nd.label,
          width: nd.width,
          height: nd.height
        })
        // to do list 节点较多时，应该允许每个节点的add和translate合并成一个promise和其他节点的生成并行，而不是同步操作
        await editor.addNode(node)
        await area.translate(nd.id, nd.position);
      }

      // 还原画布transform
      await area.area.zoom(data.transform.scale);
      await area.area.translate(data.transform.x, data.transform.y);

      // ld = lineData
      for (const ld of data.lines) {
        const connection = new Connection(
          editor.getNode(ld.source) as UniNode,
          ld.sourceOutput,
          editor.getNode(ld.target) as UniNode,
          ld.targetInput,
        );
        connection.flowType = ld.flowType;
        connection.dataType = ld.dataType;
        await editor.addConnection(connection);
      }
    },
    export() {
      const nodes: Array<UniNode> = editor.getNodes()
      const transform = area.area.transform
      return {
        id,
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
            label: node.label,
            width: node.width,
            height: node.height,
            position: view.position
          }
        }),
        lines: editor.getConnections().map((connection) => ({
          id: connection.id,
          source: connection.source,
          sourceOutput: connection.sourceOutput,
          target: connection.target,
          targetInput: connection.targetInput,
          flowType: connection.flowType,
          dataType: connection.dataType,
        })),
      }
    },
    dropAdd: (item: RawDataFlowNode | null) => {
      if (item) {
        dropAdd.add(() => {
          return createNode({
            name: item.name,
            label: item.label,
            width: item.width,
            height: item.height
          })
        })
      } else dropAdd.remove()
    },
    deleteSelect: async () => {
      selector.entities.forEach(async (entity) => {
        switch (entity.label) {
          case "connection": {
            await editor.removeConnection(entity.id);
            break;
          }
          case "node": {
            const connections = editor.getConnections().filter((c) => {
              return c.source === entity.id || c.target === entity.id;
            });
            for (const connection of connections) {
              await editor.removeConnection(connection.id);
            }
            await editor.removeNode(entity.id);
            break;
          }
        }
      });
    },
    destroy() {
      editor.clear()
      dropAdd.destroy()
      area.destroy()
    }
  }
}
