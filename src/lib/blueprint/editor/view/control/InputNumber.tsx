import { InputNumber } from 'antd'
import { UniControl } from '../../tool/uniNode'
import './InputNumber.scss'
import { getControlTheme } from '../../defaultTheme'

export function InputNumberControlView(props: { data: UniControl }) {
  const theme = getControlTheme('inputNumber')

  return <InputNumber
    className="starmap-view-input-number"
    placeholder={props.data.placeholder || '输入数字'}
    defaultValue={props.data.value || 0}
    style={{
      '--number-background-color': theme.color.background,
      '--number-padding': `0 ${theme.size.paddingLeft}`,
      '--number-height': `${theme.size.height}`,
      '--number-font-size': `${theme.size.font}`,
      '--number-font-color': `${theme.color.font}`,
      '--number-placeholder-color': `${theme.color.placeholder}`,
      '--number-line-height': `${parseFloat(theme.size.height) - parseFloat(theme.size.border) * 2}px`,
      '--number-normal-border': `${theme.size.border} solid ${theme.color.normalBorder}`,
      '--number-focus-border': `${theme.size.border} solid ${theme.color.focusBorder}`,
      '--number-border-radius': `${theme.size.borderRadius}`,
      '--number-normal-shadow': `${theme.color.normalShadow}`
    } as React.CSSProperties}
  />
}
