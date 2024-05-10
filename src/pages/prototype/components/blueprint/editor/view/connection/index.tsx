import './index.scss'
import { Schemes } from '../../define'
import { Presets } from 'rete-react-plugin'

const { useConnection } = Presets.classic

export function ConnectionView(_props: {
  data: Schemes["Connection"] & { isLoop?: boolean }
  styles?: () => unknown
}) {

  const { path } = useConnection()
  if (!path) return

  return (
    <svg
      data-testid="connection"
      className="customized-connection"
    >
      <path
        d={path}
      />
    </svg>
  )
}