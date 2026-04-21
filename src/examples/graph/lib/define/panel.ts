import type { LayoutDirection, OrientationSetting } from "../index"

// 目前设计了4个预设公布栏操作，main对应的是常驻的主菜单，asset对应的可拖拽的资产栏，popup对应的是选中某个内容后展示的悬浮工具栏，custom则对应的是完全交由用户自定义的一个工具栏槽位。
// 除了popup比较特殊以外，main和asset其实都可以被设置为custom，因为其本质就是搭载了大量预设的custom
type ToolListName = 'main' | 'asset' | 'popup' | 'custom'

// 描述各种工具栏浮窗数据结构
export interface ToolListSetting {
  name: ToolListName
  orientation?: OrientationSetting
  layoutDirection?: LayoutDirection
  style?: 'icon' // style表示选择的工具栏风格，目前只有icon一种
}
// Required<>

// 内置工具指令集
// 这个指令也可以通过外部的方法进行扩展
export enum ToolExec {
  IMPORT = 'import',
  EXPORT = 'export'
}
