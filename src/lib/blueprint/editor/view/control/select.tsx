import { Select } from 'antd'
import { StarmapControlType } from '../../define'
import { UniControl } from '../../tool/uniNode'
import './InputNumber.scss'

export function SelectControlView(props: { data: UniControl }) {
  if (!props.data.options.options) return

  return <Select
    className="starmap-view-select"
    options={props.data.options.options}
    defaultValue={props.data.options.options[0]}
  />
}
