import type { Orientation, LayoutDirection } from "../index"

// 描述各种工具栏浮窗数据结构
export interface ToolListSetting {
  name: string
  orientation?: Orientation
  layoutDirection?: LayoutDirection
}
