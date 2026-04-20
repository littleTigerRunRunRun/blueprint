/* 通用类型 */
export type EnumRecord<T extends keyof any, U> = { [K in T]?: U }
export type Callback = (...argus: any[]) => void
export type side = 't' | 'b' | 'l' | 'r'
export type Point = { x: number, y: number }
export type Rect = { x: number, y: number, width: number, height: number }
export type Bound = { xmin: number, xmax: number, ymin: number, ymax: number }

/* Graph相关的类型 */

export interface GraphMain {
  defineCustomPattern:() => void
}

// GCS = GraphCustomService
export enum GCS {
  BG = 'background'
}

// GCS设置的数据结构
export interface GCSParams {
  [GCS.BG]: string
}

// GCS操作工具
export type GCSTools = EnumRecord<GCS, GCSParams[GCS]>

export type GCSToolUseParam = 
  // GCS.BG
  ['pureBG', string] | 
  ['pointBG', { background: string, point: { interval: number, r: number, color: string } }] |
  ['gridBG', { background: string, mainGrid: { interval: number, width:number, color: string }, subGrid: { interval: number, width:number, color: string } }]
  
export interface GCSApp<GD extends GetGraphDefine<GraphNode, GraphLine, GraphGroup, GraphSocket>> {
  tools: GCSTools
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

interface UMLNode extends GraphNode {
  label: string
  x: number
  y: number
  width: number
  height: number
}

interface UMLLine extends GraphLine {
  sourceSocket: string
  targetSocket: string
}

type SocketSide = 'in' | 'out'

interface UMLSocket extends GraphSocket {
  node: string // socket依附的node的id
  side: SocketSide // 是进线口还是出线口
}

interface UMLGroup extends GraphGroup {

}

// 预设1: UML图，节点可缩放、拖动位置，连线由锚点生成，并且连线可以编辑
export type PrefabUML = GetGraphDefine<UMLNode, UMLLine, UMLGroup, UMLSocket>
