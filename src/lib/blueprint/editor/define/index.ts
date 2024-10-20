import { type GetSchemes, ClassicPreset } from "rete"
import type { ClassicScheme, ReactArea2D } from "rete-react-plugin"
import { type SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import type { StarmapConnection, StarmapNode, StarmapGraph, StarmapNodeCategory, StarmapDataType, StarmapSocketType } from './data'
import { UniNode } from '../tool/uniNode'
import { extraEvent } from '../plugin'

export * from './data'

export interface StarmapSocket extends ClassicPreset.Socket {
  flowType: StarmapSocketType
  dataType: StarmapDataType
}

export class Connection<A extends UniNode, B extends UniNode> extends ClassicPreset.Connection<A, B> {
  flowType?: StarmapSocketType
  dataType?: StarmapDataType
  isLoop?: boolean
  selected?: boolean
}

export type Schemes = GetSchemes<
  UniNode,
  Connection<UniNode, UniNode>
>

type MyArea2D<T extends ClassicScheme> = ReactArea2D<T> | extraEvent

export type AreaExtra = ReactArea2D<Schemes>

export type MyAreaExtra = MyArea2D<Schemes>

export type Callback = (...argus: unknown[]) => void

export enum StarmapAbility {
  NODE_SELECTABLE = 'node_selectable',
  HOT_KEY = 'hot_key'
}

export enum StarmapExec {
  IMPORT = 'import',
  EXPORT = 'export',
  DELETE_SELECT = 'delete_select',
  CLEAR = 'clear'
}

export interface AbilityHotKeyConfig {
  key: string
  exec: StarmapExec
}

export type StarmapAbilityDefine = Array<
  [StarmapAbility.NODE_SELECTABLE] |
  [StarmapAbility.HOT_KEY, Array<AbilityHotKeyConfig>]
>

export interface StarmapNodeDefine {
  id?:string
  instanceNum?: number
  name: string
  label: string
  theme: string
  category: Array<StarmapNodeCategory>
  nest?: Array<StarmapNodeCategory> // 可否成为容器节点
  // parent?: string
  // nest?: NestConfig // 可否成为容器节点
  // children?: Array<NodeId>
  // label: string // 节点名称
  // status: {
  //   error: boolean // 错误节点，比如画布中已经删除但是在蓝图中仍然存在的节点
  // }
}

export type Level2StringInfo = Record<string, Record<string, string>>

export interface StarmapTheme {
  node: {
    style: Level2StringInfo
    themes: Level2StringInfo
  }
  connection: {
    style: Level2StringInfo
    themes: Level2StringInfo
  }
  socket: {
    style: Level2StringInfo
    themes: Level2StringInfo
  }
  control: Record<string, Level2StringInfo>
  globalStyle: Level2StringInfo
}

export interface StarmapEditorConfig {
  // renderer: 'react' // 如果未来需要支持vue的话，另处理
  container: HTMLElement
  // nodeDefine?: Record<string, StarmapNodeDefine>
  assets?: Record<string, [string, unknown]>
  theme?: StarmapTheme
  abilities?: StarmapAbilityDefine
  eventHandlers?: {
    onNodeSelected?: (node:SelectorEntity&{node:UniNode}) => void
    onNodeUnselected?: (node:SelectorEntity&{node:UniNode}) => void
    onNodeAdd?: (node:UniNode) => void
    onNodeRemove?: (node:UniNode) => void
  }
}

export interface StarmapEditorCallExec {
  // get data from other way, data:StarmapGraph<StarmapNode, StarmapConnection>
  [StarmapExec.IMPORT]: () => Promise<void>
  [StarmapExec.EXPORT]: () => StarmapGraph<StarmapNode, StarmapConnection>
  [StarmapExec.DELETE_SELECT]: () => Promise<void>
  [StarmapExec.CLEAR]: () => Promise<void>
}


export interface StarmapEditor {
  destroy: () => void
  export: () => StarmapGraph<StarmapNode, StarmapConnection>
  import: (data:StarmapGraph<StarmapNode, StarmapConnection>) => void
  dropAdd: (item: StarmapNodeDefine|null) => void
  callExec: StarmapEditorCallExec
}