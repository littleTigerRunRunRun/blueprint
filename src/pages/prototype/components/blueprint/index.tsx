import { useRete } from 'rete-react-plugin'
import { createEditor } from './editor'

function Blueprint() {
  const ref = useRete(createEditor) as never;

  return (
    <div>
      <div ref={ref} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default Blueprint