import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'

export type Callback = (...argus: any[]) => void
export type Side = 't' | 'b' | 'l' | 'r'
export type Point = { x: number, y: number }
export type Rect = { x: number, y: number, width: number, height: number }
export type Bound = { xmin: number, xmax: number, ymin: number, ymax: number }

// 键盘相关功能工具
export interface KeyboardTool {
  // checkAuxiliary(key:'ctrl'|'alt'|'shift'|'space'):boolean // 检查快捷键功能的启用性
  bindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback):void
  unbindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback):void
  destroy():void
}

// // 指令（右键菜单、按钮等用于调取）
// export enum GraphExec {
//   SET_LINE = 'setLine',
//   SET_RECT_SELECT = 'setRectSelect',
//   CREATE_GROUP = 'createGroup',
//   SPLIT_GROUP = 'splitGroup',
//   CREATE_TEMPLATE = 'createTemplate',
//   IMPORT_TEMPLATE = 'importTemplate',
//   CHANGE_NODE_STATUS = 'changeNodeStatus',
//   ADD_LINE_INFO = 'addLineInfo',
//   SET_DIRECTION = 'setDirection'
// }

// export interface GraphExecCallback {
//   [GraphExec.DELETE_SELECT]: Callback
//   [GraphExec.CLEAR]: Callback
//   [GraphExec.ADD_NODE_FROM_SELECTING]: (s?:side) => void
//   [GraphExec.DROP_ADD]: GraphEditor['dropAdd']
//   [GraphExec.SET_LINE]: (params:GraphLineParams) => void
//   [GraphExec.SET_RECT_SELECT]: (value?:boolean) => void
//   [GraphExec.CREATE_GROUP]: () => void
//   [GraphExec.SPLIT_GROUP]: () => void
//   [GraphExec.CREATE_TEMPLATE]: () => void
//   [GraphExec.IMPORT_TEMPLATE]: () => void
//   [GraphExec.CHANGE_NODE_STATUS]: (param: { id:string, parent?:string, status: boolean }) => void
//   [GraphExec.ADD_LINE_INFO]: (param: { id:string, info: string }) => void
//   [GraphExec.SET_DIRECTION]: (param: side) => void
// }

// 指令集
export const enum GraphExec {
  IMPORT = 'import', // 导入
  EXPORT = 'export', // 导出
  DELETE_SELECT = 'delete_select', // 删除选中
  CLEAR = 'clear', // 清空画布
  DROP_ADD = 'dropAdd', // 拖放资产
  ADD_NODE = 'addNode', // 从选中内容处添加
}

export type GraphExecutor = {
  [K in GraphExec]?: Callback;
}

// export interface GraphExecCallback<T extends BaseGraphDefine> {
//   [GraphExec.IMPORT]: () => Promise<void>
//   [GraphExec.EXPORT]: () => GraphData<T>
// }

// export type GetGraphExecSchemes<T extends GraphExec, U extends GraphExecCallback<BaseGraphDefine>> = {
//   exec: T
//   callback: U
// }

// 线型
export enum GraphLineType {
  STRAIGHT = 'straight', // 直线
  MANHATTAN = 'manhattan', // 垂直折线
  CURVE = 'curve', // 三次贝塞尔曲线
  // 带自动布局的线型
  CLUSTERCURVE = 'clusterCurve', // 聚合曲线（所谓聚合，就是指一系列平级子节点都连接到同一个父节点，从而需要进行整体自动布局）
  CLUSTERMANHATTAN = 'clusterManhattan', // 聚合折线 
}

// GE = GraphElement 图元素定义
export enum GE {
  NODE = 'node',
  LINE = 'line', // connection的说法太啰嗦，改为用line
  SOCKET = 'socket', // 线的连接点
  GROUP = 'group', // 组
}

export interface GraphNode {
  id: string
  type: GE.NODE
  name: string
  parent?: string
  label: string
}

export interface GraphLine {
  id: string
  type: GE.LINE
  source: string
  target: string
}

export interface GraphGroup {
  id: string
  type: GE.GROUP
}

export interface GraphSocket {
  name: string
  type: GE.SOCKET
}

export type GetGraphDefine<N extends GraphNode, L extends GraphLine, G extends GraphGroup, S extends GraphSocket> = {
  [GE.NODE]: N
  [GE.LINE]: L
  [GE.GROUP]: G
  [GE.SOCKET]: S
}

export type BaseGraphDefine = GetGraphDefine<GraphNode, GraphLine, GraphGroup, GraphSocket>

// 能力赋予工具
export interface Selectable {
  selected: boolean
}

export interface Sizable {
  width: number
  height: number
  x: number
  y: number
}

export interface Movable {
  x: number
  y: number
}

export interface Rotatable {
  rotation: number
}

export interface SocketLine {
  sourceSocket: string
  targetSocket?: string
  targetPosition?: Point
}

type SocketSide = 'in' | 'out'
export interface AttachToNode {
  node: string // socket依附的node的id
  side: SocketSide // 是进线口还是出线口
}

export interface GraphData<T extends BaseGraphDefine> {
  id: string // 数据流图id标识
  nodes: Array<T[GE.NODE]>
  lines: Array<T[GE.LINE]>
  transform: {
    x: number
    y: number
    scale: number
  }
}

export interface CallbackEventHandler {
  onNodeAdd?: (node: GraphNode) => void
  onNodeRemove?: (node: GraphNode) => void
  onNodeSelected?: (node: SelectorEntity & { node: GraphNode }) => void
  onNodeUnselected?: (node: SelectorEntity & { node: GraphNode }) => void
}

export interface EditorInitParams {
  id?: string
  container: HTMLDivElement
  eventHandlers?: CallbackEventHandler
}

// editor应用回调
export interface GraphEditor {
  destroy: () => void
  deleteSelect: () => void
  clear: () => void
  export: () => GraphData<BaseGraphDefine>
  import: (data: GraphData<BaseGraphDefine>) => void
  dropAdd: (item: GraphNode | null) => void,
  // dropTemplateAdd: (data: GraphNode) => void,
  createGroup: () => void
  splitGroup: () => void
  // exportTemplate: () => DataFlowGraphTemplate
}