// 本文件为蓝图编辑器所用到的数据结构的设计
export const StarmapControlDataTypeMapping = {
  input: 'string',
  inputNumber: 'number',
  select: 'unknow',
  color: ['number', 'string'],
  switch: 'boolean',
}

export enum StarmapControlType {
  'input',
  'inputNumber',
  'select',
  'color',
  'switch',
}

// control在节点上显示为一个可交互控件，而在将节点拆解为逻辑组合后能看到Control是一个变量节点
export type StarmapControl = {
  type: StarmapControlType
  readonly: boolean // 是否只读
}

export enum StarmapDataType {
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'unknow',
  'null',
}

type Port = {
  dataType: StarmapDataType
  dataOnly: boolean
}

export type StarmapInput = Port & {
  type: 'input'
}

export type StarmapOutput = Port & {
  type: 'output'
}

type NodeId = string

type NestConfig = {
  innerInputs: {
    [name: string]: StarmapInput
  }
  innerOutputs: {
    [name: string]: StarmapOutput
  }
  innerControls: {
    [name: string]: StarmapControl
  }
}

// 基础节点类型
export type StarmapNode = {
  id: NodeId
  theme: string
  parent?: string
  nest?: NestConfig // 可否成为容器节点
  children?: Array<NodeId>
  label: string // 节点名称
  inputs: {
    [name: string]: StarmapInput
  }
  outputs: {
    [name: string]: StarmapOutput
  }
  controls: {
    [name: string]: StarmapControl
  }
  status: {
    error: boolean // 错误节点，比如画布中已经删除但是在蓝图中仍然存在的节点
  }
}

// 节点设计版本一
export enum StarmapNodeType {
  'IF_ELSE',
  'TIME_DELAY',
  'TIME_LOOP',
  'GLOBAL_VARIABLE',
  'SCENE_FILTER',
  'SERIES_LOGIC',
}

export type StarmapStaticNode = StarmapNode & {
  nodeType: StarmapNodeType
}

// 节点设计版本二
// 一些最基础的逻辑模块
export enum StarmapPrimitive {
  'CONSTANT',
  'VARIABLE',
  'IF_ELSE',
  'SWITCH',
  'CUSTOM_CODE',
  'INPUT',
  'OUTPUT',
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
  status: {
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
  // transform?:Transform // 全手动编辑的蓝图需要记录用户上次缩放、拖放画布的位置
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
