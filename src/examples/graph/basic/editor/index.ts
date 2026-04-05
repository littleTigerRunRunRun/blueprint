export * from './define'

// editor cli，一个用于组装你所需的定制编辑器的工具入口
import { createEditor } from './editor'
import { type EditorInitParams } from './define'

export function makeupEditor(params: EditorInitParams) {
  // 样式定制
  const theme = {}

  // 能力定制
  const abilities = []

  return createEditor(params)
}
