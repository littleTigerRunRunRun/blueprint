import { UniNode } from '../../tool/uniNode'
import { Schemes, StarmapDataType } from '../../define'
import { RenderEmit, Presets } from 'rete-react-plugin'
// import { Tooltip } from 'antd'
import { getNodeTheme, computeBlockHeight, computeNodeSizeByDefine } from '../../defaultTheme'
import { Control } from 'rete/_types/presets/classic'
// import { initExtended, getExtended, setExtended } from './nodeStore'
import './index.scss'
import { useState } from 'react'

const { RefSocket, RefControl } = Presets.classic
const MySocket = RefSocket<Schemes>
const MyControl = RefControl<Schemes>

type Props = {
  data: UniNode
  emit: RenderEmit<Schemes>
}

export function NodeView(props: Props) {
  const selected = props.data.selected || false
  const { id, label, width, height, category, inputs, outputs, controls } = props.data
  const { theme, style } = getNodeTheme(props.data.theme)
  const [count, setCount] = useState(0)
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
        height: `${height - parseFloat(style.title.height)}px`,
        borderRadius: `0 0 ${style.main.borderRadius} ${style.main.borderRadius}`
      }}
    >
      {
        category.map((cate, ci) => {
          // if (cate.extend) initExtended(props.data.id, ci, cate.extend.activate)
          // const extended = cate.extend ? getExtended(props.data.id, ci) : false
          // console.log(extended ? [...cate.content, ...(cate.extendContent || [])] : cate.content)
          // '--socket-offset': style.category.socketOffset,
          return (
            <div
              className={`content-block`}
              style={{
                borderColor: theme.cateBorder,
                padding: `
                  ${cate.label || (category[ci - 1] &&!category[ci - 1].label) ? '0' : style.category.paddingVeritical} 0 
                  ${category[ci + 1] && !category[ci + 1].label ? '0' : style.category.paddingVeritical} 0
                `,
                borderBottom: (ci !== category.length - 1 && cate.label) ?style.category.borderBottomNotLast : '',
                marginBottom: cate.halfline ? `-${(computeBlockHeight(cate))}px` : 0
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
                >{ cate.label }{
                  cate.extend ? <div
                    className={`content-extend-btn ${cate.extend.activate ? 'extended' : ''}`}
                    style={{
                      right: `${style.category.paddingHorizontal}`
                    }}
                    onMouseDown={() => {
                      if (cate.extend) {
                        cate.extend.activate = !cate.extend.activate
                        const { height } = computeNodeSizeByDefine(category)
                        props.data.height = height
                        setCount(count + 1)
                      }
                    }}
                  >
                    <div className="triangle-down" />
                  </div> : ''
                }</div> : '')
              }
              {
                (cate.extend?.activate ? [...cate.content, ...(cate.extend.content || [])] : cate.content).map((item, ii) => {
                  if (item.type !== 'output' && item.type !== 'control') {
                    const inputPort = inputs[item.name]
                    if (inputPort) {
                      inputPort.socket.dataType = item.dataType || StarmapDataType.UNKNOW
                      inputPort.socket.flowType = item.flowType
                    }
                  }
                  if (item.type !== 'input' && item.type !== 'control') {
                    const outputPort = outputs[item.name]
                    if (outputPort) {
                      outputPort.socket.dataType = item.anthorDataType || item.dataType || StarmapDataType.UNKNOW
                      outputPort.socket.flowType = item.anthorFlowType || item.flowType
                    }
                  }
                  return <div
                    className="content-socket-line"
                    key={`content_${ci}_${ii}`}
                    style={{
                      lineHeight: style.blockLine.height,
                      ...style.blockLine,
                      textAlign: (item.type === 'input' ? 'left' : (item.type === 'both' ? 'center' : 'right')),
                      padding: item.type === 'both' ? '' : `0 ${(!cate.content.includes(item as any) ? style.blockLine.extendIndent : style.blockLine.indent)}`
                    }}
                  >
                    { item.label }
                    { ii === 0 && !cate.label && cate.extend ? <div
                        className={`content-extend-btn ${cate.extend.activate ? 'extended' : ''}`}
                        style={{
                          right: `${style.category.paddingHorizontal}`
                        }}
                        onMouseDown={() => {
                          if (cate.extend) {
                            cate.extend.activate = !cate.extend.activate
                            const { height } = computeNodeSizeByDefine(category)
                            props.data.height = height
                            setCount(count + 1)
                          }
                        }}
                      >
                        <div className="triangle-down" />
                      </div> : ''
                    }
                    {
                      item.type === 'control' ? <MyControl
                        key={item.name}
                        name="control"
                        emit={props.emit}
                        payload={controls[item.name]}
                      /> : ''
                    }
                    {
                      item.type !== 'output' ? <div
                        className="socket-container input-container"
                        style={{
                          '--socket-size': style.socket.size,
                          top: style.socket.top
                        } as React.CSSProperties}
                      >
                        <MySocket
                          name="input-socket"
                          side="input"
                          emit={props.emit}
                          socketKey={item.name}
                          nodeId={id || ''}
                          payload={inputs[item.name]!.socket}
                          data-testid="input-socket"
                        /> 
                      </div> : ''
                    }
                    {
                      item.type !== 'input' ? <div
                        className="socket-container output-container"
                        style={{
                          '--socket-size': style.socket.size,
                          top: style.socket.top
                        } as React.CSSProperties}
                      >
                        <MySocket
                          name="output-socket"
                          side="output"
                          emit={props.emit}
                          socketKey={item.name}
                          nodeId={id || ''}
                          payload={outputs[item.name]!.socket}
                          data-testid="output-socket"
                        /> 
                      </div>: ''
                    }
                    {/* {
                      item.type === 'input' && inputs[item.name]?.control && inputs[item.name]?.showControl ? (
                        <MyControl
                          key={item.name}
                          name="input-control"
                          emit={props.emit}
                          payload={inputs[item.name]!.control as Control}
                        />
                      ) : ''
                    }
                    {
                      item.type === 'output' && outputs[item.name]?.control && outputs[item.name]?.showControl ? (
                        <MyControl
                          key={item.name}
                          name="output-control"
                          emit={props.emit}
                          payload={outputs[item.name]!.control as Control}
                        />
                      ) : ''
                    } */}
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