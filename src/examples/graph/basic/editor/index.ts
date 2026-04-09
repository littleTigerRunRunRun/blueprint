export * from './define'

// editor cli，一个用于组装你所需的定制编辑器的工具入口
import { createEditor } from './editor'
import { type EditorInitParams, GraphExec, GraphLineType, GraphNoParamExec } from './define'
import { BlueprintKeyboard } from './tool/keyborad'
import { global } from './global'


export async function makeupEditor(params: EditorInitParams) {
  // 样式定制
  const theme = {}

  // 约束条件: 定义能使用哪些约束
  // 资产唯一性约束：某些资产仅能放入一次，或者要求必须存在
  // 连线点约束：有特殊的要求，比如不能自连接、不能循环连接等等
  // 连线状态约束：连线的走势有特殊的逻辑要求等
  const constraints = []

  // 能力定制
  const abilities = []
  
  const editor = await createEditor(params)

  // 指令
  const callExec = {
    [GraphExec.IMPORT]: async (): Promise<void> => {
      // const data = await tools.getImportData()
      const data = JSON.parse(localStorage._testSaveGraph)
      await editor.import(data)
    },
    [GraphExec.EXPORT]: () => {
      const exportData = editor.export()
      localStorage._testSaveGraph = JSON.stringify(exportData)
      return exportData
    },
    [GraphExec.DELETE_SELECT]: () => {
      editor.deleteSelect()
    },
    [GraphExec.CLEAR]: () => {
      editor.clear()
    },
    [GraphExec.DROP_ADD]: editor.dropAdd,
    [GraphExec.SET_LINE]: (name: 'type' | 'flow' | 'arrow', params:any) => {
      switch (name) {
        case 'type':
          global.lineType = params
          break
        case 'flow':
          global.lineFlow = params
          break
        case 'arrow':
          global.lineArrow = params
          break
      }
      
    }
  }
  global.exec = callExec
  // to do: 框选插件

  BlueprintKeyboard([
    { key: 'delete', exec: GraphNoParamExec.DELETE_SELECT }
  ], callExec)

  return callExec
}
