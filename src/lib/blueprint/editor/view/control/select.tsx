import { Select } from 'antd'
import { UniControl } from '../../tool/uniNode'
import './select.scss'
import { getControlTheme } from '../../defaultTheme'

export function SelectControlView(props: { data: UniControl }) {
  if (!props.data.options.options) return

  const theme = getControlTheme('select')
  // console.log('select theme', theme)
  const body = document.body
  body.style.setProperty('--select-popup-background-color', `${theme.color.popupBackground}`)
  body.style.setProperty('--select-popup-hover-background-color', `${theme.color.popupHoverBackground}`)
  body.style.setProperty('--select-font-color', `${theme.color.font}`)
  body.style.setProperty('--select-normal-shadow', `${theme.color.normalShadow}`)
  body.style.setProperty('--select-font-focus-color', `${theme.color.focusFont}`)

  return <Select
    className="starmap-view-select"
    popupClassName="starmap-view-select-popup"
    options={props.data.options.options}
    defaultValue={props.data.options.options[0]}
    style={{
      '--select-background-color': theme.color.background,
      '--select-padding': `0 ${theme.size.paddingLeft}`,
      '--select-font-size': `${theme.size.font}`,
      '--select-font-color': `${theme.color.font}`,
      '--select-font-focus-color': `${theme.color.focusFont}`,
      '--select-normal-border': `${theme.size.border} solid ${theme.color.normalBorder}`,
      '--select-focus-border': `${theme.size.border} solid ${theme.color.focusBorder}`,
      '--select-border-radius': `${theme.size.borderRadius}`,
      '--select-height': `${theme.size.height}`,
      '--select-arrow-size': `${theme.size.arrow}`,
      '--select-arrow-color': `${theme.color.arrow}`,
      '--select-arrow-inset': `${theme.size.arrowStart} ${theme.size.arrowEnd}`,
      '--select-normal-shadow': `${theme.color.normalShadow}`
    } as React.CSSProperties}
  />
}
