import { useEffect, useRef } from 'react'
import { starmap, type StarmapEditor } from './editor'
import './index.scss'

function Blueprint() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let editor:StarmapEditor|undefined
    if (container.current && !editor) {
      starmap(container.current).then((edit) => {
        editor = edit
      })
    }
    
    return () => {
      if (editor) editor.destroy()
    }
  }, [])

  return (
    <div
      className="blueprint-container"
      ref={container}
    />
  )
}

export default Blueprint