import { Button } from 'antd'
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

export function BlueprintToolbar() {
  return (
    <div className="blueprint-toolbar">
      {
        toolbarList.map((tool, index) => {
          return <Button key={`key_${index}`} type="primary" shape="circle" icon={tool.icon} />
        })
      }
    </div>
  )
}
