import { Layout, Tabs } from 'antd'
import './NodePanel.scss'
import { tabs } from './NodePanelUse'

const { Sider } = Layout

function NodePanel() {
  // const [collapsed, setCollapsed] = useState(false)
  

  return (
    <Sider width="240" className="node-panel">
      <Tabs
        tabPosition="left"
        type="card"
        items={tabs}
        defaultActiveKey='1'
      />
    </Sider>
  )
}

export default NodePanel