import type { ToolListSetting } from './panel'
import type { GraphExecutor, GraphExec, BaseGraphDefine, Callback } from './editor'
export * from './panel'
export * from './editor'

/* 通用类型 */
export type EnumRecord<T extends keyof any, U> = { [K in T]?: U }
export type Orientation = 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l' | 'lt' // 8个方向
export type GraphDirection = 'LR' | 'RL' | 'H' | 'TB' | 'BT' | 'V' | 'R' // H = horizontal 水平，即可以左也可以右 V = vertical 竖直，即可以上也可以下，R为无方向, radial
export type LayoutDirection = 'v' | 'h' // vertical & horizontal
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
  TL = 'toolList', // 涉及到的所有工具栏，包括固定的工具栏、资产工具栏、浮动工具栏
  KB = 'keyboard',
  EXEC = 'exec', // 用户绑定自定义指定
}

// GCS设置的数据结构
export interface GCSParams {
  [GCS.BG]: string
  [GCS.IS]: string
  [GCS.TL]: ToolListSetting
  [GCS.KB]: Array<{ key: string, exec: GraphExec | string }>
  [GCS.EXEC]: Array<{ name: string, exec: Callback }>
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
  ['toolList', ToolListSetting] |
  ['keyboard', Array<{ key: string, exec: GraphExec | string }>] | 
  ['exec', Array<{ name: string, exec: Callback }>]
  
export interface GCSApp<GD extends BaseGraphDefine> {
  tools: GCSTools
  arrayTools: GCSArrayTools
  container:HTMLDivElement|null
  // icons:Record<string, string>
  set(...params: GCSToolUseParam): void
  // defineGraph(element:GE, name:string, dataDefine:GD[GE.NODE]): void
  // defineIcons(icons:Record<string, string>): void
  // getIcon(icon:string): string
  onReady(container:HTMLDivElement): void
}

// 预设1: UML图，节点可缩放、拖动位置，连线由锚点生成，并且连线可以编辑
// export interface UMLNode extends GraphNode, Selectable, Sizable {}

// export interface UMLLine extends GraphLine, Selectable, SocketLine {}

// export interface UMLSocket extends GraphSocket, AttachToNode {}

// export interface UMLGroup extends GraphGroup, Selectable {}

// export type PrefabUML = GetGraphDefine<UMLNode, UMLLine, UMLGroup, UMLSocket>