import { createEditor } from './reteBase'
import { StarmapEditorConfig, StarmapEditor, StarmapAbility, StarmapExec, AbilityHotKeyConfig } from './define'
import { BlueprintKeyboard } from './keyborad'

export * from './define'

export async function starmap(container: HTMLElement, config?:StarmapEditorConfig):Promise<StarmapEditor> {
  // 向配置中融入默认配置
  const abilities = (config && config?.abilities) || [
    [StarmapAbility.NODE_SELECTABLE],
    [StarmapAbility.HOT_KEY, [
      { key: 'delete', exec: StarmapExec.DELETE_SELECT }
    ]]
  ]

  const editor = await createEditor({
    container,
    abilities,
    themes: config && config?.theme,
    eventHandlers: {
      onNodeSelected(node) {
        console.log('node selected', node)
      },
      onNodeUnselected(node) {
        console.log('node unselected', node)
      }
    }
  })

  function callExec(exec:StarmapExec) {
    switch (exec) {
      case StarmapExec.IMPORT: {
        const graphData = JSON.parse(localStorage.exportSaveData)
        editor?.import(graphData)
        break
      }
      case StarmapExec.EXPORT: {
        const graphData = editor.export()
        console.log('export', graphData)
        localStorage.exportSaveData = JSON.stringify(graphData)
        break
      }
      case StarmapExec.DELETE_SELECT: {
        editor.deleteSelect()
        break
      }
      case StarmapExec.CLEAR: {
        editor.clear()
        break
      }
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