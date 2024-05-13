import './index.scss'
import type { Schemes } from '../../define'
import { RenderEmit } from 'rete-react-plugin'

type NodeExtraData = { width?: number; height?: number }

type Props = {
  data: Schemes["Node"] & NodeExtraData
  styles?: () => unknown
  emit: RenderEmit<Schemes>
}

export function GroupView(props: Props) {
  const selected = props.data.selected || false
  const { id, label, width, height } = props.data

  return <div
    className={`customized-group ${selected ? 'selected' : ''}`}
    style={{
      width: `${width}px`,
      height: `${height}px`
    }}
    data-testid="group"
  >
    <div className="border" />
    <div className="customized-title">{ label }{ id }</div>
    <div className="customized-content">
    </div>
  </div>
}