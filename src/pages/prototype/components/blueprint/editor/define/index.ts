import { type GetSchemes, ClassicPreset } from "rete"
import type { ReactArea2D } from "rete-react-plugin"
import type { StarmapConnection, StarmapNode, StarmapGraph, StarmapPort, StarmapControl } from './data'
import { UniNode } from '@/lib/uniNode'

export * from './data'

type Node = UniNode<'text'|'number', string|number>

class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> {}

export type Schemes = GetSchemes<
  Node,
  Connection<Node, Node>
>

export type AreaExtra = ReactArea2D<Schemes>

export type Callback = (...argus: unknown[]) => void

export enum StarmapAbility {
  NODE_SELECTABLE,
  HOT_KEY
}

export enum StarmapExec {
  IMPORT,
  EXPORT,
  DELETE_SELECT
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
  nodeId?:string // 区分于rete内部的id系统
  name: string
  label: string
  define: {
    theme: string
    category: Array<
      {
        label?: string
        content: Array<
          { label: string, name: string, type: 'input', description: StarmapPort } |
          { label: string, name: string, type: 'output', description: StarmapPort } |
          { label: string, name: string, type: 'control', description: StarmapControl }
        >
      }
    >
    // parent?: string
    // nest?: NestConfig // 可否成为容器节点
    // children?: Array<NodeId>
    // label: string // 节点名称
    // inputs: {
    //   [name: string]: StarmapInput
    // }
    // outputs: {
    //   [name: string]: StarmapOutput
    // }
    // controls: {
    //   [name: string]: StarmapControl
    // }
    // status: {
    //   error: boolean // 错误节点，比如画布中已经删除但是在蓝图中仍然存在的节点
    // }
  }
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
  globalStyle: Level2StringInfo
}

export interface StarmapEditorConfig {
  // renderer: 'react' // 如果未来需要支持vue的话，另处理
  nodeDefine: Record<string, StarmapNodeDefine>
  assets: Record<string, [string, unknown]>
  theme?: StarmapTheme
  abilities?: StarmapAbilityDefine
}

export interface StarmapEditor {
  destroy: () => void
  export: () => StarmapGraph<StarmapNode, StarmapConnection>
  import: (data:StarmapGraph<StarmapNode, StarmapConnection>) => void
  dropAdd: (item: StarmapNodeDefine|null) => void
  callExec(exec:StarmapExec):void
}
