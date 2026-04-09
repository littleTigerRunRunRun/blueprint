import { GraphLineType, type GraphExecCallback } from './define'
// 需要全局使用的引用内容

declare interface GraphGlobal {
  lineType: GraphLineType
  lineFlow: boolean
  lineArrow: boolean
  connectionSelector: any
  exec: GraphExecCallback | null
  hoveringSocket: {
    nodeId: string
    key: string
  } | null
}

export const global:GraphGlobal = {
  lineType: GraphLineType.MANHATTAN,
  lineFlow: false,
  lineArrow: false,
  connectionSelector: null,
  exec: null,
  hoveringSocket: null
}