import { type GetSchemes, ClassicPreset, type ConnectionBase, type NodeBase, getUID } from 'rete'
import type { VueArea2D } from 'rete-vue-plugin'
import { UniNode } from './tool/uniNode'
import type { nodeScaleEvent } from './plugin'
import type { DataflowNode } from 'rete-engine'
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'

export type Callback = (...argus: any[]) => void
export type side = 't' | 'b' | 'l' | 'r'
export type Point = { x: number, y: number }
export type Rect = { x: number, y: number, width: number, height: number }
export type Bound = { xmin: number, xmax: number, ymin: number, ymax: number }

// editor基础定义
// 重写了Connection，主要原因是retejs作为一个严谨的库，限制了只有output作为source，input作为target，而在我们的项目中这是不一定的（可以限制但是也可以不做限制）
export class Connection<
  Source extends UniNode,
  Target extends UniNode
> implements ConnectionBase {
  id: ConnectionBase['id']
  source: NodeBase['id']
  target: NodeBase['id']
  // flowType?: GSFlowType
  // dataType?: GSDataType
  selected?: boolean
  line: GraphLineParamsObject = {
    type: GraphLineType.MANHATTAN,
    flow: false,
    solid: true,
    arrow: false
  }
  sourceAnchor?:Point
  targetAnchor?:Point
  constructor(
    id: string,
    source: Source,
    public sourceOutput: keyof Source['outputs'],
    target: Target,
    public targetInput: keyof Target['inputs']
  ) {
    this.id = id || getUID()
    this.source = source.id
    this.target = target.id
  }
}

export type Schemes = GetSchemes<UniNode, Connection<UniNode, UniNode>>

export type MyAreaExtra = VueArea2D<Schemes> | nodeScaleEvent

// 还未初始化到画布前的节点定义
export declare interface RawDataFlowNode {
  label: string
  name: string
  width: number
  height: number
}

// 模版节点数据虽然和节点数据DataFlowNode一样拥有id和position，但是在用于生成时，仅仅用于给connection指示首尾，以及生成其他节点的相对位置
export declare interface TemplateDataFlowNode extends RawDataFlowNode {
  id: string
  position: Point // 模版节点的position在导出时会将模版内容的中心位置归零，而这里保存的position将会是节点和模版中心点的相对位置
}

export declare interface DataFlowGroupShrinkInfo {
  width: number
  height: number
  nodes: Array<DataFlowNode>
  lines: Array<DataFlowLine>
}

// 数据结构定义
export declare interface DataFlowNode extends TemplateDataFlowNode {
  parent?: string // 是否存在parent节点
  expand?: boolean
  shrinkInfo?: DataFlowGroupShrinkInfo
}

export declare interface DataFlowGroup extends DataFlowNode {}

export declare interface DataFlowGraphTemplate {
  nodes: Array<TemplateDataFlowNode>
  lines: Array<DataFlowLine>
}

export declare interface DataFlowLine {
  id: string
  source: string
  sourceOutput: string // output name of source
  target: string
  targetInput: string // input name of target
  line: GraphLineParamsObject
  sourceAnchor?:Point
  targetAnchor?:Point
}

export declare interface DataFlowGraph {
  id: string // 数据流图id标识
  direction: side
  nodes: Array<DataFlowNode>
  lines: Array<DataFlowLine>
  transform: {
    x: number
    y: number
    scale: number
  }
}

// 数据连接点涉及的数据类型
// GS = graph socket
export enum GSDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  UNKNOW = 'unknow',
  NULL = 'null',
  ANY = 'any' // 可以是任何类型，也就是说不做类型限制
}

// 数据连接点的流类型
export enum GSFlowType {
  CONTROL = 'control',
  DATA = 'data',
  UNI = 'uni' // 通用类型
}

// 无参数指令（快捷键）
// export enum GraphNoParamExec {
//   IMPORT = 'import',
//   EXPORT = 'export',
//   DELETE_SELECT = 'delete_select',
//   CLEAR = 'clear',
//   ADD_NODE_FROM_SELECTING = 'addNodeFromSelecting'
// }

// 指令（右键菜单、按钮等用于调取）
export enum GraphExec {
  IMPORT = 'import',
  EXPORT = 'export',
  DELETE_SELECT = 'delete_select',
  CLEAR = 'clear',
  DROP_ADD = 'dropAdd',
  SET_LINE = 'setLine',
  REARRANGE = 'rearrange',
  ADD_NODE_FROM_SELECTING = 'addNodeFromSelecting',
  SET_RECT_SELECT = 'setRectSelect',
  CREATE_GROUP = 'createGroup',
  SPLIT_GROUP = 'splitGroup',
  CREATE_TEMPLATE = 'createTemplate',
  IMPORT_TEMPLATE = 'importTemplate',
  CHANGE_NODE_STATUS = 'changeNodeStatus',
  ADD_LINE_INFO = 'addLineInfo',
  SET_DIRECTION = 'setDirection'
}

export interface GraphExecCallback {
  [GraphExec.IMPORT]: (data: DataFlowGraph) => Promise<void>
  [GraphExec.EXPORT]: () => DataFlowGraph
  [GraphExec.DELETE_SELECT]: Callback
  [GraphExec.CLEAR]: Callback
  [GraphExec.ADD_NODE_FROM_SELECTING]: (s?:side) => void
  [GraphExec.DROP_ADD]: GraphEditor['dropAdd']
  [GraphExec.SET_LINE]: (params:GraphLineParams) => void
  [GraphExec.REARRANGE]: Callback
  [GraphExec.SET_RECT_SELECT]: (value?:boolean) => void
  [GraphExec.CREATE_GROUP]: () => void
  [GraphExec.SPLIT_GROUP]: () => void
  [GraphExec.CREATE_TEMPLATE]: () => void
  [GraphExec.IMPORT_TEMPLATE]: () => void
  [GraphExec.CHANGE_NODE_STATUS]: (param: { id:string, parent?:string, status: boolean }) => void
  [GraphExec.ADD_LINE_INFO]: (param: { id:string, info: string }) => void
  [GraphExec.SET_DIRECTION]: (param: side) => void
}

// 图形节点类型
export enum GraphNodeType {
  START = 'start',
  END = 'end',
  NODE = 'node',
  TEXT = 'text',
  TEMPLATE = 'template'
}

// editor应用
export interface GraphEditor {
  destroy: () => void
  deleteSelect: () => void
  clear: () => void
  export: () => DataFlowGraph
  import: (data: DataFlowGraph) => void
  dropAdd: (item: RawDataFlowNode | null) => void,
  dropTemplateAdd: (data: DataFlowGraphTemplate) => void,
  updateSelectingLine: (params: GraphLineParams) => void,
  addNodeFromSelecting: (nodeInfo:RawDataFlowNode, s:side) => void
  createGroup: () => void
  splitGroup: () => void
  exportTemplate: () => DataFlowGraphTemplate
  changeNodeStatus: (param: { id:string, parent?:string, status: boolean }) => void
  addLineInfo: (param: { id:string, info: string }) => void
  setDirection: (param: side) => void
}

// 无需参数的指令集，主要用于给快捷键系统调取
// export interface GraphExecNoParamCallback {
//   [GraphExec.IMPORT]: () => Promise<void>
//   [GraphExec.EXPORT]: () => DataFlowGraph
//   [GraphExec.DELETE_SELECT]: Callback
//   [GraphExec.CLEAR]: Callback
//   [GraphExec.ADD_NODE_FROM_SELECTING]: Callback
// }

export type GraphLineParamsObject = {
  type: GraphLineType,
  flow: boolean,
  solid: boolean,
  arrow: boolean
}

export type GraphLineParams = { attr: keyof GraphLineParamsObject, param: GraphLineParamsObject[keyof GraphLineParamsObject] }

export interface CallbackEventHandler {
  onNodeAdd?: (node: DataflowNode) => void
  onNodeRemove?: (node: DataflowNode) => void
  onNodeSelected?: (node: SelectorEntity & { node: UniNode }) => void
  onNodeUnselected?: (node: SelectorEntity & { node: UniNode }) => void
}

export enum GraphAbility {
  NODE_SELECTABLE = 'node_selectable', // 节点可选能力
  HOT_KEY = 'hot_key' // 快捷键
}

export interface EditorInitParams {
  id?: string
  direction?: side
  container: HTMLElement
  eventHandlers: CallbackEventHandler
  abilities: Array<GraphAbility>
}

// 线型
export enum GraphLineType {
  STRAIGHT = 'straight', // 直线
  MANHATTAN = 'manhattan', // 垂直折线
  CURVE = 'curve', // 三次贝塞尔曲线
  // 带自动布局的线型
  CLUSTERCURVE = 'clusterCurve', // 聚合曲线（所谓聚合，就是指一系列平级子节点都连接到同一个父节点，从而需要进行整体自动布局）
  CLUSTERMANHATTAN = 'clusterManhattan', // 聚合折线
}

// export enum GraphLineArrow {
//   NONE = 'none', // 无箭头
//   SOLID = 'solid', // 实心箭头
//   HALLOW = 'hallow', // 空心箭头
// }

// 键盘相关功能工具
export interface KeyboardTool {
  checkAuxiliary(key:'ctrl'|'alt'|'shift'|'space'):boolean // 检查快捷键功能的启用性
  bindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback):void
  unbindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback):void
  destroy():void
}