import { createEditor } from './reteBase'
import { StarmapEditorConfig, StarmapEditor, StarmapAbility, StarmapExec, AbilityHotKeyConfig, StarmapGraph, StarmapNode, StarmapConnection } from './define'
import { BlueprintKeyboard } from './tool/keyborad'
import { defaultTheme } from './defaultTheme'

export * from './define'
export * from './tool/transformer'

interface ToolArgument {
  getImportData(): Promise<StarmapGraph<StarmapNode, StarmapConnection>>
  exportCallback(data:StarmapGraph<StarmapNode, StarmapConnection>): void
}

// 这一层组件的目的，是为了为蓝图编辑器注入默认配置项以及准备对外暴露的接口
export async function starmap(config:StarmapEditorConfig, tools:ToolArgument):Promise<StarmapEditor> {
  // 向配置中融入默认配置
  const abilities = (config && config?.abilities) || [
    [StarmapAbility.NODE_SELECTABLE],
    [StarmapAbility.HOT_KEY, [
      { key: 'delete', exec: StarmapExec.DELETE_SELECT }
    ]]
  ]

  const editor = await createEditor({
    container: config.container,
    abilities,
    assets: config.assets || {},
    theme: config && config?.theme || defaultTheme,
    eventHandlers: config.eventHandlers || {}
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callExec = {
    [StarmapExec.IMPORT]: async ():Promise<void> => {
      const data = await tools.getImportData()
      return editor.import(data)
    },
    [StarmapExec.EXPORT]: ():StarmapGraph<StarmapNode, StarmapConnection> => {
      const exportData = editor.export()
      tools.exportCallback(exportData)
      return exportData
    },
    [StarmapExec.DELETE_SELECT]: ():Promise<void> => {
      return editor.deleteSelect()
    },
    [StarmapExec.CLEAR]: ():Promise<void> => {
      return editor.clear()
    }
  }

  const hotkeySetting = abilities.find((item) => item[0] === StarmapAbility.HOT_KEY)
  if (hotkeySetting) {
    BlueprintKeyboard(hotkeySetting[1] as Array<AbilityHotKeyConfig>, callExec)
  }

  return {
    destroy: editor.destroy,
    import: editor.import,
    export: editor.export,
    dropAdd: editor.dropAdd,
    callExec
  }
}