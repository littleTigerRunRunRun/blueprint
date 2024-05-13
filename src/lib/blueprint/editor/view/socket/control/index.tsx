import { getSocketTheme } from '../../../defaultTheme'
import './index.scss'
import { UniSocket } from '../../../tool/uniNode'

declare interface SocketProps {
  data: UniSocket
}

export function ControlSocketView(props: SocketProps) {
  const { style, theme } = getSocketTheme(props.data.dataType)
  const stroke = style.main.border.split(' ')
  stroke[0] = `${parseFloat(stroke[0])}`

  return <div
    className="control-socket"
  >
    <svg viewBox="0 0 10 10">
      <path
        stroke={stroke[0]}
        strokeWidth={stroke[2]}
        fill={theme.main}
        d="M0,0 L5,0 L10,5 L5,10 L0,10 Z"
      />
    </svg>
  </div>
}