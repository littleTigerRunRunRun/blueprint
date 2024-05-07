import { type GetSchemes, ClassicPreset } from "rete"
import type { ReactArea2D } from "rete-react-plugin"
import type { StarmapAllConnection, StarmapAllNode, StarmapGraph, StarmapNode, StarmapInput, StarmapOutput, StarmapControl } from './data'
import { UniNode } from '@/lib/uniNode'

export * from './data'

type Node = UniNode<'text'|'number', string|number>

class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> {}

export type Schemes = GetSchemes<
  Node,
  Connection<Node, Node>
>

export type AreaExtra = ReactArea2D<Schemes>

export enum StarMapAbility {
  NODE_SELECTABLE,
  HOT_KEY
}

export enum StarMapExec {

}

export interface AbilityHotKeyConfig {
  key: string
  excute: StarMapExec
}

export interface StarmapNodeDefine {
  name: string
  label: string
  define: {
    theme: string
    // parent?: string
    // nest?: NestConfig // 可否成为容器节点
    // children?: Array<NodeId>
    // label: string // 节点名称
    inputs: {
      [name: string]: StarmapInput
    }
    outputs: {
      [name: string]: StarmapOutput
    }
    controls: {
      [name: string]: StarmapControl
    }
    // status: {
    //   error: boolean // 错误节点，比如画布中已经删除但是在蓝图中仍然存在的节点
    // }
  }
}

export type StarMapAbilityDefine = Array<
  [StarMapAbility.NODE_SELECTABLE] |
  [StarMapAbility.HOT_KEY, Array<AbilityHotKeyConfig>]
>

type Level2StringInfo = Record<string, string | Record<string, string>>

export interface StarmapTheme {
  node: {
    style: Level2StringInfo
    themes: Record<string, Record<string, string>>
  }
  connection: {
    style: Level2StringInfo
    themes: Record<string, Record<string, string>>
  }
  socket: {
    style: Level2StringInfo
    themes: Record<string, Record<string, string>>
  }
  globalStyle: Level2StringInfo
}

export interface StarmapEditorConfig {
  // renderer: 'react' // 如果未来需要支持vue的话，另处理
  nodeDefine: Record<string, StarmapNodeDefine>
  assets: Record<string, [string, unknown]>
  theme?: StarmapTheme
  abilities?: StarMapAbilityDefine
}

export interface StarmapEditor {
  destroy: () => void
  export: () => StarmapGraph<StarmapAllNode, StarmapAllConnection>
  import: (data:StarmapGraph<StarmapAllNode, StarmapAllConnection>) => void
  dropAdd: (item: StarmapNodeDefine|null) => void
}
