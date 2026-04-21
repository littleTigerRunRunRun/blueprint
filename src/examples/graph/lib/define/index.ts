import type { ToolListSetting } from './panel'

/* 通用类型 */
export type EnumRecord<T extends keyof any, U> = { [K in T]?: U }
export type Callback = (...argus: any[]) => void
export type Side = 't' | 'b' | 'l' | 'r'
export type Orientation = 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l' | 'lt' // 8个方向
export type LayoutDirection = 'v' | 'h' // vertical & horizontal
export type Point = { x: number, y: number }
export type Rect = { x: number, y: number, width: number, height: number }
export type Bound = { xmin: number, xmax: number, ymin: number, ymax: number }
export type PositionDescription = number | string // 可以是具体的数字，也可以是百分比
export type OrientationSetting = 
  { ori: 't', top: PositionDescription } |
  { ori: 'b', bottom: PositionDescription } |
  { ori: 'l', left: PositionDescription } |
  { ori: 'r', right: PositionDescription } |
  { ori: 'rt', top: PositionDescription, right: PositionDescription } |
  { ori: 'lt', top: PositionDescription, left: PositionDescription } |
  { ori: 'rb', bottom: PositionDescription, right: PositionDescription } |
  { ori: 'lb', bottom: PositionDescription, left: PositionDescription }

/* Graph相关的类型 */

export interface GraphMain {
  defineCustomPattern:() => void
}

// GCS = GraphCustomService
export enum GCS {
  BG = 'background',
  IS = 'innerShadow', // 界面的内阴影
  TL = 'toolList'
}

// GCS设置的数据结构
export interface GCSParams {
  [GCS.BG]: string
  [GCS.IS]: string
  [GCS.TL]: ToolListSetting
}

// GCS操作工具
export type GCSO = GCS.BG | GCS.IS
export type GCSA = GCS.TL
export type GCSTools = EnumRecord<GCSO, GCSParams[GCSO]>
export type GCSArrayTools = EnumRecord<GCSA, Array<GCSParams[GCSA]>>

export type GCSToolUseParam = 
  // GCS.BG
  ['pureBG', string] | 
  ['pointBG', { background: string, point: { interval: number, r: number, color: string } }] |
  ['gridBG', { background: string, mainGrid: { interval: number, width:number, color: string }, subGrid: { interval: number, width:number, color: string } }] |
  ['innerShadow', { color: string, intensity: 1 | 2 | 3 }] | // 由于阴影风格属于预设，这里只能通过调整强度来综合调整内阴影的大小、透明度
  ['toolList', ToolListSetting]
  
export interface GCSApp<GD extends BaseGraphDefine> {
  tools: GCSTools
  arrayTools: GCSArrayTools
  set(...params: GCSToolUseParam): void
  defineGraph(element:GE, name:string, dataDefine:GD[GE.NODE]): void
}

// GE = GraphElement 图元素定义
export enum GE {
  NODE = 'node',
  LINE = 'line', // connection的说法太啰嗦，改为用line
  SOCKET = 'socket', // 线的连接点
  GROUP = 'group', // 组
}

export interface GraphNode {
  id: string
  type: GE.NODE
  name: string
  parent?: string
}

export interface GraphLine {
  id: string
  type: GE.LINE
  source: string
  target: string
}

export interface GraphGroup {
  id: string
  type: GE.GROUP
}

export interface GraphSocket {
  name: string
  type: GE.SOCKET
}

export type GetGraphDefine<N extends GraphNode, L extends GraphLine, G extends GraphGroup, S extends GraphSocket> = {
  [GE.NODE]: N
  [GE.LINE]: L
  [GE.GROUP]: G
  [GE.SOCKET]: S
}

export type BaseGraphDefine = GetGraphDefine<GraphNode, GraphLine, GraphGroup, GraphSocket>

// 能力赋予工具
export interface Selectable {
  selected: boolean
}

export interface Sizable {
  width: number
  height: number
  x: number
  y: number
}

export interface Movable {
  x: number
  y: number
}

export interface Rotatable {
  rotation: number
}

export interface SocketLine {
  sourceSocket: string
  targetSocket?: string
  targetPosition?: Point
}

type SocketSide = 'in' | 'out'
export interface AttachToNode {
  node: string // socket依附的node的id
  side: SocketSide // 是进线口还是出线口
}

// 预设1: UML图，节点可缩放、拖动位置，连线由锚点生成，并且连线可以编辑
export interface UMLNode extends GraphNode, Selectable, Sizable {}

export interface UMLLine extends GraphLine, Selectable, SocketLine {}

export interface UMLSocket extends GraphSocket, AttachToNode {}

export interface UMLGroup extends GraphGroup, Selectable {}

export type PrefabUML = GetGraphDefine<UMLNode, UMLLine, UMLGroup, UMLSocket>