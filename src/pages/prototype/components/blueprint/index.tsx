import { useEffect, useState, useRef } from 'react'
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
  const [exec, callExec] = useState('')
  const [editor, setEditor] = useState<StarmapEditor>()

  useEffect(() => {
    if (container.current && !editor) {
      starmap(container.current).then((edit) => {
        setEditor(edit)
        setOpening(true)
      })
    }
    
    return () => {
      if (editor) editor.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    switch (exec) {
      case 'import': {
        console.log('import')
        break
      }
      case 'export': {
        console.log('export')
        break
      }
    }
  }, [exec])

  useEffect(() => {
    if (editor) {
      editor.dropAdd(props.dragging)
    }
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