import './index.scss'
import { Schemes, StarmapDataType } from '../../define'
import { Presets } from 'rete-react-plugin'
import { getThemes, getSocketTheme } from '../../defaultTheme'

const { useConnection } = Presets.classic

export function ConnectionView(props: {
  data: Schemes["Connection"]
  click?: () => void
}) {

  const { path } = useConnection()
  if (!path) return

  const { style } = getThemes().connection
  const socketTheme = props.data.dataType ? getSocketTheme(props.data.dataType || StarmapDataType.NULL) : null
  // 打开log就会发现这里有严重的多重渲染bug
  // console.log(props.data.dataType, socketTheme.theme.main)

  return (
    <svg
      data-testid="connection"
      className="customized-connection"
      onPointerDown={(e:React.PointerEvent) => e.stopPropagation()}
      onClick={props.click}
    >
      <path
        className={`view-path ${props.data.socketType ? (props.data.socketType === 'data' ? 'data-path' : 'control-path') : ''}`}
        d={path}
        style={{
          stroke: socketTheme ? socketTheme.theme.main : (props.data.selected ? style.selected.stroke : style.main.stroke),
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