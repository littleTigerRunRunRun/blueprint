import './index.scss'
import { ClassicPreset } from 'rete'

export function SocketView<T extends ClassicPreset.Socket>(_props: {
  data: T
}) {
  return <div className="customized-socket"></div>
}