import type { LayoutDirection, OrientationSetting } from "../index"

// 目前设计了4个预设公布栏操作，main对应的是常驻的主菜单，asset对应的可拖拽的资产栏，popup对应的是选中某个内容后展示的悬浮工具栏，custom则对应的是完全交由用户自定义的一个工具栏槽位。
// 除了popup比较特殊以外，main和asset其实都可以被设置为custom，因为其本质就是搭载了大量预设的custom
type ToolListName = 'main' | 'asset' | 'popup' | 'custom'

interface IconTool {
  icon: string // icon名，icon需要用app的defineIcons方法注册才能使用
  tooltip: string // 鼠标移动上去需要显示的提示信息
  exec: any // 点击后需要执行的行为
}

// 工具栏上的按钮型工具，按钮点击一下就生效一下
export interface IconToolButton extends IconTool {
  type: 'button'
}

// 工具栏上的切换按钮型工具，点一下就切换一下状态，一般在true和false之间进行状态切换
export interface IconToolSwitch extends IconTool {
  type: 'switch'
}

// 颜色选择工具
export interface IconToolColor extends IconTool {
  type: 'color'
}

// 资产型工具，一般是制定了某种资产，可以通过拖拽加到画布上
export interface IconToolDrag {
  type: 'drag'
  icon: string
  tooltip?: string
  asset: any // 资产定义格式
}

// 单选工具，从几个项中选择一个值作为状态
export interface IconToolRadio {
  type: 'radio'
  exec: any // 点击后需要执行的行为
  tools: Array<{
    icon: string
    value: any // 级联项对应的值，点击后执行exec然后传递value
  }>
}

// 下拉选择
export interface IconToolSelect {
  type: 'select'
  exec: any // 点击后需要执行的行为
  tools: Array<{
    icon?: string
    label: string
    value: any // 级联项对应的值，点击后执行exec然后传递value
  }>
}

export interface IconToolDrawer {
  type: 'drawer'
  icon?: string
  label?: string
  tooltip?: string
  hold?: boolean // 是否在点击之后可以长期存在（需要再次点击后关闭）
  exec?: any
  tools: Array<IconToolButton | IconToolDrag | IconToolDrawer>
}

export type ToolSeperation = {
  type: 'seperate'
  size1: number // 顺序方向上的size，对于水平工具栏，这个值等于width，对于垂直工具栏，这个值等于height
  size2: number
  padding: [number, number]
}

export type ToolCustom = {
  type: 'custom'
  name: string
}

// 描述各种工具栏浮窗数据结构
export interface ToolListSetting {
  name: ToolListName
  size: number // icon尺寸，垂直方向上的size，例如对于横向的工具栏，就是height，对于纵向的工具栏就是width
  orientation?: OrientationSetting
  layoutDirection?: LayoutDirection
  style?: 'icon' // style表示选择的工具栏风格预设，目前只有icon一种，当然，用户也可以通过css自行定制样式
  content: Array<IconToolButton | IconToolRadio | IconToolDrag | IconToolDrawer | IconToolColor | IconToolSwitch | IconToolSelect | ToolSeperation | ToolCustom>
}
// Required<>

// 内置工具指令集
// 这个指令也可以通过外部的方法进行扩展
export enum ToolExec {
  IMPORT = 'import',
  EXPORT = 'export'
}
