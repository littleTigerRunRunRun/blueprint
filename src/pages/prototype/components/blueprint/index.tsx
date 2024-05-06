import { useEffect, useState, useRef } from 'react'
import { starmap, type StarmapEditor } from './editor'
import './index.scss'
import { BlueprintToolbar } from './tools'

function Blueprint() {
  const container = useRef<HTMLDivElement>(null)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    let editor:StarmapEditor|undefined
    if (container.current && !editor) {
      starmap(container.current).then((edit) => {
        editor = edit
        setOpening(true)
      })
    }
    
    return () => {
      if (editor) editor.destroy()
    }
  }, [])

  return (
    <div className="blueprint-container">
      <BlueprintToolbar />
      <div className={`blueprint-ref ${opening ? 'show' : ''}`} ref={container} />
    </div>
  )
}

export default Blueprint