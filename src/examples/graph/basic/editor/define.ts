import { type GetSchemes, ClassicPreset, type ConnectionBase, type NodeBase, getUID } from 'rete'
import type { VueArea2D } from 'rete-vue-plugin'
import { UniNode } from './tool/uniNode'
import type { nodeScaleEvent } from './plugin'
import type { DataflowNode } from 'rete-engine'
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'

export type Callback = (...argus: any[]) => void

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

// 数据结构定义
export declare interface DataFlowNode {
  id: string
  label: string
  name: string
  width: number
  height: number
  position: { x: number; y: number }
}

export declare interface DataFlowGroup extends DataFlowNode {}

export declare interface DataFlowLine {
  id: string
  source: string
  sourceOutput: string // output name of source
  target: string
  targetInput: string // input name of target
  // flowType?: GSFlowType
  // dataType?: GSDataType
  line: GraphLineParamsObject
}

export declare interface DataFlowGraph {
  id: string // 数据流图id标识
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
  ADD_NODE_FROM_SELECTING = 'addNodeFromSelecting'
}

// 图形节点类型
export enum GraphNodeType {
  START = 'start',
  END = 'end',
  NODE = 'node'
}

// editor应用
export interface GraphEditor {
  destroy: () => void
  deleteSelect: () => void
  clear: () => void
  export: () => DataFlowGraph
  import: (data: DataFlowGraph) => void
  dropAdd: (item: RawDataFlowNode | null) => void,
  updateSelectingLine: (params: GraphLineParams) => void,
  addNodeFromSelecting: (nodeInfo:RawDataFlowNode) => void
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
  flow: false,
  solid: true,
  arrow: false
}

export type GraphLineParams = { attr: keyof GraphLineParamsObject, param: GraphLineParamsObject[keyof GraphLineParamsObject] }

export interface GraphExecCallback {
  [GraphExec.IMPORT]: () => Promise<void>
  [GraphExec.EXPORT]: () => DataFlowGraph
  [GraphExec.DELETE_SELECT]: Callback
  [GraphExec.CLEAR]: Callback
  [GraphExec.ADD_NODE_FROM_SELECTING]: Callback
  [GraphExec.DROP_ADD]: GraphEditor['dropAdd']
  [GraphExec.SET_LINE]: (params:GraphLineParams) => void
  [GraphExec.REARRANGE]: Callback
}

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
