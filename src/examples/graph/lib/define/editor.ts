import type { BaseGraphDefine, GE } from './index'

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

// 指令集
export const enum GraphExec {
  IMPORT = 'import', // 导入
  EXPORT = 'export', // 导出
  DELETE_SELECT = 'delete_select', // 删除选中
  CLEAR = 'clear', // 清空画布
  DROP_ADD = 'dropAdd', // 拖放资产
  ADD_FROM_SELECTING = 'addFromSelecting', // 从选中内容处添加
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