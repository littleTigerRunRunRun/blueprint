import { Input } from 'antd'
import { StarmapControlType } from '../../define'
import { UniControl } from '../../tool/uniNode'
import './Input.scss'


export function InputControlView(props: { data: UniControl<StarmapControlType.INPUT> }) {
  return <>
    <Input className="starmap-view-input" placeholder="输入字符串" defaultValue={props.data.value} />
  </>
}