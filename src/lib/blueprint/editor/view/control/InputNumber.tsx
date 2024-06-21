import { InputNumber } from 'antd'
import { UniControl } from '../../tool/uniNode'
import './InputNumber.scss'

export function InputNumberControlView(props: { data: UniControl }) {
  return <InputNumber className="starmap-view-input-number" placeholder="输入字符串" defaultValue={props.data.value} />
}
