import { Input } from 'antd'
import { UniControl } from '../../tool/uniNode'
import './Input.scss'
import { getControlTheme } from '../../defaultTheme'


export function InputControlView(props: { data: UniControl }) {
  const theme = getControlTheme('input')
  // console.log(props)

  return <>
    <Input
      className="starmap-view-input"
      placeholder={props.data.placeholder || '输入字符串'}
      defaultValue={props.data.value}
      style={{
        '--input-background-color': theme.color.background,
        '--input-padding': `0 ${theme.size.paddingLeft}`,
        '--input-height': `${theme.size.height}`,
        '--input-font-size': `${theme.size.font}`,
        '--input-font-color': `${theme.color.font}`,
        '--input-placeholder-color': `${theme.color.placeholder}`,
        '--input-line-height': `${parseFloat(theme.size.height) - parseFloat(theme.size.border) * 2}px`,
        '--input-normal-border': `${theme.size.border} solid ${theme.color.normalBorder}`,
        '--input-focus-border': `${theme.size.border} solid ${theme.color.focusBorder}`,
        '--input-border-radius': `${theme.size.borderRadius}`,
        '--input-normal-shadow': `${theme.color.normalShadow}`
      } as React.CSSProperties}
    />
  </>
}