import './index.scss'
import type { Schemes } from '../../define'
import { RenderEmit, Presets } from 'rete-react-plugin'
import { Tooltip } from 'antd'
import { getNodeTheme } from '../../defaultTheme'

const { RefSocket, RefControl } = Presets.classic

type NodeExtraData = { width?: number; height?: number, theme?: string }

type Props = {
  data: Schemes["Node"] & NodeExtraData
  styles?: () => unknown
  emit: RenderEmit<Schemes>
}

export function NodeView(props: Props) {
  const inputs = Object.entries(props.data.inputs)
  const outputs = Object.entries(props.data.outputs)
  const controls = Object.entries(props.data.controls)
  const selected = props.data.selected || false
  const { id, label, width, height } = props.data
  const theme = getNodeTheme(props.data.theme)

  return <div
    className={`customized-node ${selected ? 'selected' : ''}`}
    style={{
      width: `${width}px`,
      height: `${height}px`
    }}
    data-testid="node"
  >
    <div className="border" />
    <Tooltip title={`${label}${id}`} color={'#35bfff'}>
      <div
        className="customized-title"
        style={{
          backgroundColor: theme.title
        }}
      >{ label }{ id }</div>
    </Tooltip>
    <div
      className="customized-content"
      style={{
        backgroundColor: theme.content
      }}
    >
      <div
        className="content-block align-right"
        style={{
          borderColor: theme.cateBorder
        }}
      >
        <div className="content-block-title">事件</div>
        {
          /* Outputs */
          outputs.map(([key, output]) => {
            if (!output) return
            return <div
              className="content-socket-line"
              key={`${key}`}
            >
              { output.label }
              <div className="socket-container">
                <RefSocket
                  name="output-socket"
                  side="output"
                  emit={props.emit}
                  socketKey={key}
                  nodeId={id}
                  payload={output.socket}
                  data-testid="output-socket"
                />
              </div>
            </div>
          })
        }
      </div>
      {
        controls.map(([key, control]) => {
          return control ? (
            <RefControl
              key={key}
              name="control"
              emit={props.emit}
              payload={control}
            />
          ) : null
        })
      }
      <div
        className="content-block align-left no-next"
        style={{
          borderColor: theme.cateBorder
        }}
      >
        <div className="content-block-title">动作</div>
        {
          /* Inputs */
          inputs.map(([key, input]) => {
            if (!input) return
            return <div
              className="content-socket-line"
              key={`${key}`}
            >
              { input.label }
              <div className="socket-container">
                <RefSocket
                  name="input-socket"
                  emit={props.emit}
                  side="input"
                  socketKey={key}
                  nodeId={id}
                  payload={input.socket}
                  data-testid="input-socket"
                />
              </div>
              {
                input?.control && input?.showControl && (
                  <span className="input-control">
                    <RefControl
                      key={key}
                      name="input-control"
                      emit={props.emit}
                      payload={input.control}
                    />
                  </span>
                )
              }
            </div>
          })
        }
      </div>
    </div>
  </div>
}