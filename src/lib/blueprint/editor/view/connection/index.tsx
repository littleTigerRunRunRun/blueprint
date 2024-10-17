import './index.scss'
import { Schemes, StarmapDataType } from '../../define'
import { getThemes, getSocketTheme } from '../../defaultTheme'
import { Presets } from 'rete-react-plugin'

export function ConnectionView(props: {
  data: Schemes["Connection"]
  click?: () => void
}) {

  // rete-react-plugin插件的这个方法有bug，，它会导致任何一个connection变更时，所有的connection全都触发重计算。。
  const { path } = Presets.classic.useConnection()
  if (!path) return

  const { style } = getThemes().connection
  const socketTheme = props.data.dataType ? getSocketTheme(props.data.dataType || StarmapDataType.NULL) : null 
  // 打开log就会发现这里有严重的多重渲染bug, 但是暂时没有找到合适的解决方法
  // console.log(props.data.id)

  return (
    <svg
      data-testid="connection"
      className="customized-connection"
      onPointerDown={(e:React.PointerEvent) => e.stopPropagation()}
      onClick={props.click}
    >
      <path
        className={`view-path ${props.data.flowType ? (props.data.flowType === 'data' ? 'data-path' : 'control-path') : ''}`}
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