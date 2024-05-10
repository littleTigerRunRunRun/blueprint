import './index.scss'
import { UniNode } from '../../uniNode'
import { Schemes, StarmapDataType } from '../../define'
import { RenderEmit, Presets } from 'rete-react-plugin'
// import { Tooltip } from 'antd'
import { getNodeTheme } from '../../defaultTheme'
import { Control } from 'rete/_types/presets/classic'

const { RefSocket, RefControl } = Presets.classic

type Props = {
  data: UniNode
  emit: RenderEmit<Schemes>
}

export function NodeView(props: Props) {
  const selected = props.data.selected || false
  const { id, label, width, height, category, inputs, outputs, controls } = props.data
  const { theme, style } = getNodeTheme(props.data.theme)
  // console.log(props)

  return <div
    className={`customized-node ${selected ? 'selected' : ''}`}
    style={{
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: style.main.borderRadius
    }}
    data-testid="node"
  >
    <div
      className="border"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: style.main.borderRadius,
        border: selected ? style.selected.border : style.main.border,
        filter: selected ? `drop-shadow(${style.selected.dropShadow})` : ''
      }}
    />
    {/* <Tooltip title={`${label}`} color={'#35bfff'}>
    </Tooltip> */}
    <div
      className="customized-title"
      style={{
        backgroundColor: theme.title,
        borderRadius: `${style.main.borderRadius} ${style.main.borderRadius} 0 0`,
        lineHeight: style.title.height,
        ...style.title
      }}
    >{ label }</div>
    <div
      className="customized-content"
      style={{
        backgroundColor: theme.content,
        borderRadius: `0 0 ${style.main.borderRadius} ${style.main.borderRadius}`
      }}
    >
      {
        category.map((cate, ci) => {
          return (
            <div
              className={`content-block align-${cate.align}`}
              style={{
                borderColor: theme.cateBorder,
                padding: `
                  ${cate.label || (category[ci - 1] &&!category[ci - 1].label) ? '0' : style.category.paddingVeritical} 
                  ${cate.align === 'left' ? '0' : style.category.paddingHorizontal} 
                  ${category[ci + 1] && !category[ci + 1].label ? '0' : style.category.paddingVeritical} 
                  ${cate.align === 'left' ? style.category.paddingHorizontal : '0'}
                `,
                borderBottom: (ci !== category.length - 1 && cate.label) ?style.category.borderBottomNotLast : '',
                '--socket-offset': style.category.socketOffset
              } as React.CSSProperties}
              key={`cate_${ci}`}
            >
              {
                (cate.label ? <div
                  className="content-block-title"
                  style={{
                    lineHeight: style.blockTitle.height,
                    ...style.blockTitle
                  }}
                >{ cate.label }</div> : '')
              }
              {
                cate.content.map((item, ii) => {
                  const port = item.type === 'input' ? inputs[item.name] : outputs[item.name]
                  if (port && 'dataType' in item) port.socket.type = item.dataType || StarmapDataType.UNKNOW
                  return <div
                    className="content-socket-line"
                    key={`content_${ci}_${ii}`}
                    style={{
                      lineHeight: style.blockLine.height,
                      ...style.blockLine
                    }}
                  >
                    { item.label }
                    <div
                      className="socket-container"
                      style={{
                        '--socket-size': style.socket.size,
                        top: style.socket.top
                      } as React.CSSProperties}
                    >
                      {
                        item.type === 'control' ?
                          <RefControl
                            key={item.name}
                            name="control"
                            emit={props.emit}
                            payload={controls[item.name]}
                          />
                        : (
                          <>
                            {/* {`${item.type}_${item.name}_${item.dataType}`} */}
                            <RefSocket
                              name={`${item.type}-socket`}
                              side={item.type}
                              emit={props.emit}
                              socketKey={`socket_${item.type}_${item.name}`}
                              nodeId={id || ''}
                              payload={(item.type === 'input' ? inputs[item.name]!.socket : outputs[item.name]!.socket)}
                              data-testid={`${item.type}-socket`}
                            />
                            {
                              item.type === 'input' && inputs[item.name]?.control && inputs[item.name]?.showControl ? (
                                <span className="input-control">
                                  <RefControl
                                    key={`control_${item.type}_${item.name}`}
                                    name="input-control"
                                    emit={props.emit}
                                    payload={inputs[item.name]!.control as Control}
                                  />
                                </span>
                              ) : ''
                            }
                          </>
                        )
                      }
                    </div>
                  </div>
                })
              }
            </div>
          )
        })
      }
    </div>
  </div>
}