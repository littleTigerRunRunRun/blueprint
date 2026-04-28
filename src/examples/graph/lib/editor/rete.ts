// rete 插件体系引用
import { ClassicPreset as Classic, type GetSchemes, NodeEditor, getUID } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { VuePlugin, Presets, type VueArea2D } from 'rete-vue-plugin'
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { getDOMSocketPosition } from 'rete-render-utils'
// import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin' // , type Size
// import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
  type SocketData,
  type Context,
  getSourceTarget,
  makeConnection
} from 'rete-connection-plugin'
// import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'

// 视图优化

// 自研工具引用
import { attachSmoothArea } from "./smoothZoom";
import { DropAddPlugin, NodeScalablePlugin, RectSelectPlugin, NodeScaleRotatePlugin, type nodeScaleEvent } from './plugin'
import './plugin/node-scale-rotate.scss'
import { subscriber } from '../tools/Subscriber'

import type { GraphExecutor, EditorInitParams, CallbackEventHandler } from "../define";

type Schemes = GetSchemes<Classic.Node, Classic.Connection<Classic.Node, Classic.Node>>
type MyAreaExtra = VueArea2D<Schemes> | nodeScaleEvent

// area move limit
// area move is rectSelect
// connection canMakePreudo
// connection makeConnection
export class ReteEditor {
  protected id:string
  protected container:HTMLDivElement
  public area:AreaPlugin<Schemes, MyAreaExtra>
  public editor:NodeEditor<Schemes>
  public dropAdd:DropAddPlugin
  // protected eventHandlers:CallbackEventHandler
  constructor(config:EditorInitParams) {
    const { id, container } = config

    this.id = id || getUID()
    this.container = container
    // this.eventHandlers = eventHandlers
    
    // 编辑器核心ClassicPreset.Node
    const editor = new NodeEditor<Schemes>()
    
    // 拖拽、缩放等画布功能插件
    const area = new AreaPlugin<Schemes, MyAreaExtra>(container, {
      move: {}
    })
    // 顺滑area缩放
    attachSmoothArea(area)

    // 连线插件
    const connection = new ConnectionPlugin<Schemes, MyAreaExtra>()
    
    // 渲染插件
    const render = new VuePlugin<Schemes, MyAreaExtra>()
    
    // 支持父子组件嵌套的插件
    // const scopes = new ScopesPlugin<Schemes>({})
    
    // 右键菜单插件
    // const contextMenu = new ContextMenuPlugin<Schemes>() as any
    
    // 自动布局插件
    // const arrange = new AutoArrangePlugin<Schemes>()
    
    // 节点拖拽加入插件（自研）
    const dropAdd = new DropAddPlugin(undefined, {
      onNodeAdd: (node) => {},
      onNodeRemove: (node) => {}
    })
    this.dropAdd = dropAdd
    
    // 节点支持缩放插件（自研）
    const nodeScale = new NodeScalablePlugin<Schemes>()
  
    // 节点支持缩放旋转插件（自研）
    const nodeScaleRotate = new NodeScaleRotatePlugin<Schemes>() as any;
  
    // 支持框选能力（自研）
    const rectSelect = new RectSelectPlugin()

    // 插件预设安装
    // arrange.addPreset(ArrangePresets.classic.setup())
    // scopes.addPreset(ScopesPresets.classic.setup())
    // render.addPreset(Presets.contextMenu.setup({ delay: 200, className: 'graph-context-menu' }) as any)
    connection.addPreset(ConnectionPresets.classic.setup());

    // 注册视图
    render.addPreset(
      Presets.classic.setup(
        // {
        //   socketPositionWatcher: getDOMSocketPosition({
        //     offset: (position, _nodeId, side, _key) => {
        //       return {
        //         x: position.x - 5,
        //         y: position.y - 5
        //       }
        //     },
        //     skipSideCheck: true,
        //   }),
        //   customize: {
        //     node(context) {
        //     },
        //     socket(_context) {
        //     },
        //     connection(_context) {
        //     }
        //   }
        // }
      )
    )
    
    // 监听事件提供线型修改中间函数
    // render.addPipe((context: any) => {
    //   if (context.type === 'connectionpath') {
    //     if (!context.data.payload.line) {
    //       context.data.payload.line = Object.assign({}, subscriber.get('line'))
    //     }
    //     return {
    //       data: {
    //         points: context.data.points,
    //         path: `${context.data.points[1].x},${context.data.points[1].y}`
    //       }
    //     }
    //   }
    //   return context
    // })
    // connection.addPipe((context: any) => {
    //   if (context.type === 'render' && context.data.payload && (!context.data.payload.line)) {
    //     context.data.payload.line = Object.assign({}, subscriber.get('line'))
    //   }
    //   return context
    // })

    // 能力注册：
    class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
      add = async (entity: E, accumulate: boolean) => {
        super.add(entity, accumulate)
  
        // if (eventHandlers?.onNodeSelected)
        //   eventHandlers.onNodeSelected({
        //     node: editor.getNode(entity.id) as UniNode,
        //     ...entity
        //   })
      }
      remove = async (entity: E) => {
        super.remove(entity)
  
        // if (eventHandlers?.onNodeUnselected)
        //   eventHandlers.onNodeUnselected({
        //     node: editor.getNode(entity.id) as UniNode,
        //     ...entity
        //   })
      }
    }
  
    // 用户自定义能力注册
    const selector = new MySelector()
    const accumulating = AreaExtensions.accumulateOnCtrl()
    const selectableNodes = AreaExtensions.selectableNodes(area, selector, { accumulating })
    subscriber.set('connectionSelector', {
      editor,
      area,
      selector,
      accumulating,
      selectableNodes
    })
    dropAdd.getSelectHanlder({
      select: selectableNodes.select,
      unselect: selectableNodes.unselect,
      unselectAll: selector.unselectAll.bind(selector)
    })

    // 链接各个插件的通信
    editor.use(area)
    area.use(connection)
    // area.use(contextMenu)
    area.use(render)
    // area.use(scopes)
    // area.use(arrange)
    area.use(dropAdd)
    area.use(nodeScale)
    area.use(nodeScaleRotate)
    area.use(rectSelect)

    this.editor = editor
    this.area = area
  }

  public destroy() {
    this.editor.clear()
    this.area.destroy()
    this.dropAdd.destroy()

    ;(this.editor as any) = null
    ;(this.area as any) = null
    ;(this.dropAdd as any) = null
  }
}