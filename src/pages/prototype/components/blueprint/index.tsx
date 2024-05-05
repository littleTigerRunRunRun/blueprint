// import { useRef } from 'react'
import { createEditor } from './editor'
import './index.scss'

function Blueprint() {
  let container // = useRef(null)

  const onMounted = (ref:HTMLDivElement | null) => {
    container = ref
    if (ref) createEditor(ref)
  }

  return (
    <div
      className="blueprint-container"
      ref={onMounted}
    />
  )
}

export default Blueprint