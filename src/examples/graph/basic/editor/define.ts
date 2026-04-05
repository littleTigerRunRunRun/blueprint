import { type GetSchemes, ClassicPreset } from 'rete'
import type { VueArea2D } from 'rete-vue-plugin'
import { UniNode } from './uniNode'
import type { nodeScaleEvent } from './plugin'
import type { DataflowNode } from 'rete-engine'
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'

// editor基础定义
export class Connection<A extends UniNode, B extends UniNode> extends ClassicPreset.Connection<
  A,
  B
> {
  isLoop?: boolean
  selected?: boolean
}

export type Schemes = GetSchemes<UniNode, Connection<UniNode, UniNode>>

export type MyAreaExtra = VueArea2D<Schemes> | nodeScaleEvent

// 数据结构定义
export declare interface DataFlowNode {
  id?: string
  label: string
  name: string
  width: number
  height: number
  position?: { x: number; y: number }
}

export declare interface DataFlowGroup extends DataFlowNode {}

export declare interface DataFlowLine {}

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

// 指令（快捷键、右键菜单、按钮等用于调取）
export enum GraphExec {
  IMPORT = 'import',
  EXPORT = 'export',
  DELETE_SELECT = 'delete_select',
  CLEAR = 'clear'
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
  dropAdd: (item: DataFlowNode | null) => void
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
  container: HTMLElement
  eventHandlers: CallbackEventHandler
  abilities: Array<GraphAbility>
}
