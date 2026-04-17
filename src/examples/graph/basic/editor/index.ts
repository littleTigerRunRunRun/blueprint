export * from './define'
export { subscriber } from './tool/Subscriber'

// editor cli，一个用于组装你所需的定制编辑器的工具入口
import { createEditor } from './editor'
import { type EditorInitParams, GraphExec, type GraphLineParams, type side } from './define'
import { BlueprintKeyboard } from './tool/keyborad'
import { subscriber } from './tool/Subscriber'

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

  // 快捷键、键盘事件管理工具
  subscriber.set('keyboard', BlueprintKeyboard([
    { key: 'delete', exec: GraphExec.DELETE_SELECT },
    { key: 'tab', exec: GraphExec.ADD_NODE_FROM_SELECTING }
  ], (key, value) => {
    if (key === 'ctrl') subscriber.set('isRectSelect', value)
  }))
  
  const editor = await createEditor(params)

  // 指令
  const callExec = {
    [GraphExec.IMPORT]: async (): Promise<void> => {
      const importTarget = location.hash
      const datastr = localStorage[importTarget]
      if (!datastr) return
      const data = JSON.parse(datastr)
      await editor.import(data)
    },
    [GraphExec.EXPORT]: () => {
      const exportData = editor.export()
      const exportTarget = location.hash
      localStorage[exportTarget] = JSON.stringify(exportData)
      return exportData
    },
    [GraphExec.DELETE_SELECT]: () => {
      editor.deleteSelect()
    },
    [GraphExec.CLEAR]: () => {
      editor.clear()
    },
    [GraphExec.DROP_ADD]: editor.dropAdd,
    [GraphExec.SET_LINE]: (params: GraphLineParams) => {
      const { param, attr } = params
      switch (attr) {
        case 'type':
          subscriber.get('line').type = param
          break
        case 'flow':
          subscriber.get('line').flow = param
          break
        case 'arrow':
          subscriber.get('line').arrow = param
          break
        case 'solid':
          subscriber.get('line').solid = param
      }
      editor.updateSelectingLine(params)
    },
    [GraphExec.ADD_NODE_FROM_SELECTING]: (s:side = 'r') => {
      editor.addNodeFromSelecting({
        name: 'node',
        label: '新建节点',
        width: 100,
        height: 40
      }, s)
    },
    [GraphExec.REARRANGE]: () => {
      console.log('重排')
    },
    [GraphExec.SET_RECT_SELECT]: (value?:boolean) => {
      if (value === undefined) subscriber.set('isRectSelect', true)
      else subscriber.set('isRectSelect', value)
    },
    [GraphExec.CREATE_GROUP]: () => {
      editor.createGroup()
    },
    [GraphExec.SPLIT_GROUP]: () => {
      editor.splitGroup()
    },
    [GraphExec.CREATE_TEMPLATE]: () => {
      const template = JSON.stringify(editor.exportTemplate())
      console.log('模版已导出', template)
      localStorage.tempTemplate = template
    },
    [GraphExec.IMPORT_TEMPLATE]: () => {
      const template = localStorage.tempTemplate
      if (template) {
        editor.dropTemplateAdd(JSON.parse(template))
      }
    },
    [GraphExec.CHANGE_NODE_STATUS]: (param:{ id:string, parent?:string, status: boolean }) => {
      editor.changeNodeStatus(param)
    },
    [GraphExec.ADD_LINE_INFO]: (param:{ id:string, info: string }) => {
      editor.addLineInfo(param)
    }
  }
  subscriber.set('exec', callExec)
  // to do: 框选插件

  return callExec
}
