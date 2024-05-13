import { useEffect, useState, useRef } from 'react'
import { starmap, type StarmapEditor } from './editor'
import './index.scss'
import { BlueprintToolbar } from './tools'
import { StarmapExec, StarmapNodeDefine } from './editor/define'

declare interface BlueprintProps {
  dragging: StarmapNodeDefine|null
  checkInstanceNumChange: (name:string, change:number) => void
}

function Blueprint(props:BlueprintProps) {
  const container = useRef<HTMLDivElement>(null)
  const [opening, setOpening] = useState(false)
  const [editor, setEditor] = useState<StarmapEditor>()
  // let editor:StarmapEditor

  useEffect(() => {
    if (container.current && !editor) {
      starmap({
        container: container.current,
        eventHandlers: {
          onNodeAdd: (node) => {
            props.checkInstanceNumChange(node.name, -1)
          },
          onNodeRemove: (node) => {
            props.checkInstanceNumChange(node.name, 1)
          }
        }
      }, {
        getImportData: async () => {
          const namespace = location.search.split('?')[1].split('=')[1] || ''
          const dataString = localStorage[`starmap_data_${namespace}`]
          return dataString ? JSON.parse(dataString) : { nodes: [], connections: [], transform: { x: 0, y: 0, scale: 1 } }
        },
        exportCallback: (data) => {
          const namespace = location.search.split('?')[1].split('=')[1] || ''
          console.log(`starmap_data_${namespace}:`, data)
          localStorage[`starmap_data_${namespace}`] = JSON.stringify(data)
        }
      }).then((edit) => {
        setOpening(true)
        setEditor(edit)
        // editor = edit
      })
    }

    if (editor) {
      editor.callExec[StarmapExec.IMPORT]()
    }
    
    return () => {
      if (editor) editor.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  function dropAdd() {
    editor?.dropAdd(props.dragging)
  }

  useEffect(() => {
    dropAdd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dragging])

  return (
    <div className="blueprint-container">
      <BlueprintToolbar callExec={editor?.callExec} />
      <div className={`blueprint-ref ${opening ? 'show' : ''}`} ref={container} />
    </div>
  )
}

export default Blueprint