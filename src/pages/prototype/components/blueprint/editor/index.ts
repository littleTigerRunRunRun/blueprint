import { createEditor } from './reteBase'
import { StarmapEditorConfig, StarmapEditor, StarmapAbility } from './define'

export * from './define'

export async function starmap(container: HTMLElement, config?:StarmapEditorConfig):Promise<StarmapEditor> {
  const editor = await createEditor({
    container,
    abilities: (config && config?.abilities) || [
      [StarmapAbility.NODE_SELECTABLE]
    ],
    themes: config && config?.theme
  })

  return {
    destroy: editor.destroy,
    import: editor.import,
    export: editor.export,
    dropAdd: editor.dropAdd
  }
}