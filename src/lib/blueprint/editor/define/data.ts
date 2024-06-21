// 本文件为蓝图编辑器所用到的数据结构的设计
export enum StarmapControlType {
  INPUT = 'input',
  INPUTNUMBER = 'inputNumber',
  SELECT = 'select',
  // COLOR = 'color',
  // SWITCH = 'switch',
}

export const StarmapControlDataTypeMapping = {
  [StarmapControlType.INPUT]: 'string',
  [StarmapControlType.INPUTNUMBER]: 'number',
  [StarmapControlType.SELECT]: 'string', // 以前是unknow
  // [StarmapControlType.COLOR]: 'string',
  // [StarmapControlType.SWITCH]: 'boolean',
}

// control在节点上显示为一个可交互控件，而在将节点拆解为逻辑组合后能看到Control是一个变量节点
interface BaseControl<T extends StarmapControlType, K extends string | number> {
  type: T
  initial?: K //  | boolean | unknown
  placeholder?: string
  readonly?:boolean
  change?:(value: K) => void
  options?: Array<{ value:string, label: string }>
}


// export interface SelectControl extends BaseControl {
//   type: StarmapControlType.SELECT
//   initial: unknown
// }

// export interface ColorControl extends BaseControl {
//   type: StarmapControlType.COLOR
//   initial: string
// }
// export interface SwitchControl extends BaseControl {
//   type: StarmapControlType.SWITCH
//   initial: boolean
// }

export interface StarmapControlOption {
  
}

// 这个Control类型需要能被扩展
// export type StarmapControl<T extends StarmapControlType, K = T extends StarmapControlType.INPUT ? string : number> = {
// export type StarmapControl<T extends StarmapControlType, K extends string | number> = {
//   type: T
//   initial?: K
//   readonly?: boolean
//   change?: (value: K) => void
// }

export interface InputControl extends BaseControl<StarmapControlType.INPUT, string> {
}

export interface InputNumberControl extends BaseControl<StarmapControlType.INPUTNUMBER, number> {
}

export interface SelectControl extends BaseControl<StarmapControlType.SELECT, string> {
  options: Array<{ value:string, label: string }>
}

export type StarmapControl = InputControl | InputNumberControl | SelectControl

export enum StarmapDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  UNKNOW = 'unknow',
  NULL = 'null'
}

export enum StarmapSocketType {
  CONTROL = 'control',
  DATA = 'data'
}

// export type StarmapInput = Port & {
//   type: 'input'
// }

// export type StarmapOutput = Port & {
//   type: 'output'
// }

type NodeId = string
// 
export type StarmapNodeCategory = {
  label?: string
  halfline?: boolean // 视图上占据整行还是只占据半行（是否会影响后续非本align侧内容的竖直位置基准）
  content: Array<
    // dataTypeDecription
    { label: string, name: string, type: 'input' | 'output' | 'both', flowType: StarmapSocketType, anthorFlowType?: StarmapSocketType, dataType?: StarmapDataType, anthorDataType?: StarmapDataType, control?: StarmapControl } |
    { label: string, name: string, type: 'control', control: StarmapControl }
  >
  extend?: {
    activate: boolean
    content: Array<
      { label: string, name: string, type: 'input' | 'output' | 'both', flowType: StarmapSocketType, anthorFlowType?: StarmapSocketType, dataType?: StarmapDataType, anthorDataType?: StarmapDataType, control?: StarmapControl } |
      { label: string, name: string, type: 'control', control: StarmapControl }
    >
  }
}

// type NestConfig = {
//   innerInputs: {
//     [name: string]: StarmapSocket
//   }
//   innerOutputs: {
//     [name: string]: StarmapSocket
//   }
//   innerControls: {
//     [name: string]: StarmapControl
//   }
// }

// 基础节点类型
export type StarmapNode = {
  id: NodeId
  name: string
  width: number
  height: number
  theme: string
  parent?: string
  nest?: Array<StarmapNodeCategory> // 可否成为容器节点
  children?: Array<NodeId>
  label: string // 节点名称
  position: { x: number, y: number }
  category: Array<StarmapNodeCategory>
  status: {
    error: boolean // 错误节点，比如画布中已经删除但是在蓝图中仍然存在的节点
  }
}

// 节点设计版本一
export enum StarmapNodeType {
  IF_ELSE = 'if_else',
  TIME_DELAY = 'time_delay',
  TIME_LOOP = 'time_loop',
  GLOBAL_VARIABLE = 'global_variable',
  SCENE_FILTER = 'scene_filter',
  SERIES_LOGIC = 'series_logic',
}

export type StarmapStaticNode = StarmapNode & {
  nodeType: StarmapNodeType
}

// 节点设计版本二
// 一些最基础的逻辑模块
export enum StarmapPrimitive {
  CONSTANT = 'constant',
  VARIABLE = 'variable',
  IF_ELSE = 'if_else',
  SWITCH = 'switch',
  CUSTOM_CODE = 'custom_code',
  INPUT = 'input',
  OUTPUT = 'output',
}

// 一种描述原语逻辑的节点，每一个这样的节点都代表着一个对应的能转换成代码的逻辑意图
export type StarmapPrimitiveNode = StarmapNode & {
  primitive: StarmapPrimitive
}

export type StarmapBaseNode = StarmapNode & {
  innerGraphId: string // 能查到一个Graph类型的图数据
}

// 逻辑组合型节点（内部包含了一个带有特殊input、output节点的小型蓝图），我们提供的常用逻辑节点其实也是这种模式
export type StarmapCombinedNode = StarmapBaseNode & {
  innerVisible: true
}

export type instanceInterfaceDefine = {
  // calle: string // 调用名
  label: string // 提示名
  argument: StarmapDataType // 输入参数或者返回参数的定义
}

// 项目中具体的组件示例对应的节点
export type StarmapInstanceNode = StarmapCombinedNode & {
  instanceId: string // 这个id用于在大屏运行中去寻找对应的组件实例
  instanceDefine: {
    inputs: Record<string, instanceInterfaceDefine>
    outputs: Record<string, instanceInterfaceDefine>
  }
}

type ConnectionId = string

export type StarmapConnection = {
  id: ConnectionId
  source: NodeId
  sourceOutput: string // output name of source
  target: NodeId
  targetInput: string // input name of target
  flowType?: StarmapSocketType
  dataType?: StarmapDataType
  status?: {
    log: boolean
  }
}

// 代表逻辑控制流向的连线
export type StarmapControlConnection = StarmapConnection & {
  type: 'control'
}

// 代表数据传递的连线
export type StarmapDataConnection = StarmapConnection & {
  type: 'data'
}

export type StarmapAllNode = StarmapPrimitiveNode | StarmapBaseNode | StarmapCombinedNode | StarmapInstanceNode

export type StarmapAllConnection = StarmapControlConnection | StarmapDataConnection

// 基础蓝图数据类
export type StarmapGraph<N extends StarmapNode, C extends StarmapConnection> = {
  transform:{
    x: number
    y: number
    scale: number
  }
  nodes: Array<N>
  connections: Array<C>
}

// 无论是从事件配置入口进去的蓝图，还是一整个全量的总蓝图，其数据结构其实都是一样的只不过，子蓝图只有一部分
// type GeneralGraph

// 调试模式蓝图数据
// type DebugNode = AllNode & {
//   errorInfo: string // 报错信息
// }

// type DebugConnection = AllConnection & {
//   flowData: any // 数据流动
// }

// type DebugGraph = Graph<DebugNode, DebugConnection>
