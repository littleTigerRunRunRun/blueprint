import { GraphLineType } from '../lib'
import type { GraphNode, GraphLine, GraphGroup, GraphSocket, GetGraphDefine, Selectable, Sizable } from '../lib'

// DFD中的Node可编辑的状态数据
export interface GraphNodeParamObject {
  graphType: string // 图形类型
  fontSize?: number // 
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
  isDeleteLine?: boolean
  textAlign?: 'left' | 'center' | 'right'
  stroke?: string
  fill?: string
  textFill?: string
  opacity?: number
}

export interface DFDGraphNode extends GraphNode, Selectable, Sizable {
  content: GraphNodeParamObject
}

export interface DFDGraphLine extends GraphLine, Selectable {}

export interface DFDGraphGroup extends GraphGroup, Sizable {}

export interface DFDGraphSocket extends GraphSocket {}

export type DFDGraphDefine = GetGraphDefine<DFDGraphNode, DFDGraphLine, DFDGraphGroup, DFDGraphSocket>