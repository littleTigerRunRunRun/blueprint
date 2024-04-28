import { Layout, Flex, Menu } from 'antd'
import { PieChartOutlined, MergeOutlined, DeploymentUnitOutlined } from '@ant-design/icons'

const { Sider } = Layout

function NodePanel() {
  // const [collapsed, setCollapsed] = useState(false)

  return (
    <Sider width="240">
      <Flex vertical={true}>
        {/* <Menu /> */}
        <div className="node-list">

        </div>
      </Flex>
    </Sider>
  )
}

export default NodePanel