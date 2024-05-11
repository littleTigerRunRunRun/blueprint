import { getSocketTheme } from '../../defaultTheme'
import './index.scss'
import { UniSocket } from '../../tool/uniNode'

declare interface SocketProps {
  data: UniSocket
}

export function SocketView(props: SocketProps) {
  const { style, theme } = getSocketTheme(props.data.dataType)

  return <div
    className="customized-socket"
    style={{
      background: theme.main,
      border: style.main.border
    }}
  />
}