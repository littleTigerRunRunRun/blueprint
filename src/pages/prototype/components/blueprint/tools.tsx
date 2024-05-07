import { Button, Tooltip } from 'antd'
import { ImportOutlined, ExportOutlined } from '@ant-design/icons'

const toolbarList = [
  {
    name: 'import',
    label: '导入',
    icon: <ImportOutlined />
  },
  {
    name: 'export',
    label: '导出',
    icon: <ExportOutlined />
  }
]

declare interface ToolbarProps {
  callExec: (exce:string) => void
}

export function BlueprintToolbar(props:ToolbarProps) {
  const { callExec } = props

  const onButtonClick = (name:string) => {
    callExec(name)
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
