import { GraphLineType, type GraphExecCallback } from './define'
// 需要全局使用的引用内容

declare interface GraphGlobal {
  lineType: GraphLineType
  connectionSelector: any
  exec: GraphExecCallback | null
}

export const global:GraphGlobal = {
  lineType: GraphLineType.MANHATTAN,
  connectionSelector: null,
  exec: null
}