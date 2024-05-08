import { Button, Tooltip } from 'antd'
import { ImportOutlined, ExportOutlined } from '@ant-design/icons'
import { StarmapExec } from './editor'

const toolbarList = [
  {
    name: StarmapExec.IMPORT,
    label: '导入',
    icon: <ImportOutlined />
  },
  {
    name: StarmapExec.EXPORT,
    label: '导出',
    icon: <ExportOutlined />
  }
]

declare interface ToolbarProps {
  callExec?: (exce:StarmapExec) => void
}

export function BlueprintToolbar(props:ToolbarProps) {
  const onButtonClick = (name:StarmapExec) => {
    if (props.callExec) props.callExec(name)
  }

  return (
    <div className="blueprint-toolbar">
      {
        toolbarList.map((tool, index) => {
          return <Tooltip title={tool.label} color={'#35bfff'} key={`key_${index}`}>
            <Button
              type="primary"
              shape="circle"
              icon={tool.icon}
              onClick={() => onButtonClick(tool.name)}
            />
          </Tooltip>
        })
      }
    </div>
  )
}
