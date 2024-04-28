import { useState } from 'react'
import { Layout } from 'antd'
import './index.scss'
import NodePanel from './components/NodePanel'

function Prototype() {
  // const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="prototype-main">
      <Layout style={{ height: '100%' }}>
        {/* <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}> */}
        <NodePanel>
        </NodePanel>
        <Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default Prototype