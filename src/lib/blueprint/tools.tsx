import { Button, Tooltip } from 'antd'
import { ImportOutlined, ExportOutlined, RestOutlined } from '@ant-design/icons'
import { StarmapExec, StarmapEditorCallExec } from './editor'

// 工具栏配置
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
  },
  {
    name: StarmapExec.CLEAR,
    label: '清空',
    icon: <RestOutlined />
  }
]

declare interface ToolbarProps {
  callExec?: StarmapEditorCallExec
}

export function BlueprintToolbar(props:ToolbarProps) {
  const onButtonClick = async (name:StarmapExec) => {
    if (props.callExec) props.callExec[name]()
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
