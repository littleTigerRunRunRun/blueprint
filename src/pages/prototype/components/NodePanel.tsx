import { Tabs } from 'antd'
import './NodePanel.scss'
import { tabs } from './NodePanelUse'

function NodePanel() {
  // const [collapsed, setCollapsed] = useState(false)
  

  return (
    <Tabs
      tabPosition="left"
      type="card"
      items={tabs}
      defaultActiveKey='1'
    />
  )
}

export default NodePanel