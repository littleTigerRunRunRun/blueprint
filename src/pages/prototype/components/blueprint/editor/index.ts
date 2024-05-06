// import { defaultTheme } from './defaultTheme'
import { createEditor } from './reteBase'
import { StarmapEditorConfig, StarmapEditor, StarMapAbility } from './define'

export * from './define'

export async function starmap(container: HTMLElement, config?:StarmapEditorConfig):Promise<StarmapEditor> {
  const editor = await createEditor(container, (config && config?.abilities) || [
    [StarMapAbility.NODE_SELECTABLE]
  ])

  return {
    destroy: editor.destroy,
    import: editor.import,
    export: editor.export
  }
}