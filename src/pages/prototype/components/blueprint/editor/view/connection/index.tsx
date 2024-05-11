import './index.scss'
import { Schemes } from '../../define'
import { Presets } from 'rete-react-plugin'
import { getThemes } from '../../defaultTheme'

const { useConnection } = Presets.classic

export function ConnectionView(props: {
  data: Schemes["Connection"]
  click?: () => void
}) {

  const { path } = useConnection()
  if (!path) return

  const { style } = getThemes().connection

  return (
    <svg
      data-testid="connection"
      className="customized-connection"
      onPointerDown={(e:React.PointerEvent) => e.stopPropagation()}
      onClick={props.click}
    >
      <path
        className="view-path"
        d={path}
        style={{
          stroke: props.data.selected ? style.selected.stroke : style.main.stroke,
          strokeWidth: style.main.strokeWidth
        }}
      />
      <path
        className="hover-path"
        d={path}
        style={{
          stroke: style.hover.stroke,
          strokeWidth: style.hover.strokeWidth
        }}
      />
    </svg>
  )
}