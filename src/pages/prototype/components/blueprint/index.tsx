import { useEffect, useState, useRef, useCallback } from 'react'
import { starmap, type StarmapEditor } from './editor'
import './index.scss'
import { BlueprintToolbar } from './tools'
import { StarmapNodeDefine } from './editor/define'

declare interface BlueprintProps {
  dragging: StarmapNodeDefine|null
}

function Blueprint(props:BlueprintProps) {
  const container = useRef<HTMLDivElement>(null)
  const [opening, setOpening] = useState(false)
  const [editor, setEditor] = useState<StarmapEditor>()
  // let editor:StarmapEditor

  useEffect(() => {
    if (container.current && !editor) {
      starmap(container.current).then((edit) => {
        setOpening(true)
        setEditor(edit)
        // editor = edit
      })
    }

    if (editor) {
      callExec('import')
    }
    
    return () => {
      if (editor) editor.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  function callExec(exec:string) {
    switch (exec) {
      case 'import': {
        const graphData = JSON.parse(localStorage.exportSaveData)
        editor?.import(graphData)
        break
      }
      case 'export': {
        if (editor) {
          const graphData = editor.export()
          console.log('export', graphData)
          localStorage.exportSaveData = JSON.stringify(graphData)
        }
        break
      }
    }
  }

  function dropAdd() {
    editor?.dropAdd(props.dragging)
  }

  useEffect(() => {
    dropAdd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dragging])

  return (
    <div className="blueprint-container">
      <BlueprintToolbar callExec={callExec} />
      <div className={`blueprint-ref ${opening ? 'show' : ''}`} ref={container} />
    </div>
  )
}

export default Blueprint