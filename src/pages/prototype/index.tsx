// import { useRef } from 'react'
import { Layout } from 'antd'
import './index.scss'
import NodePanel from './components/NodePanel'
import Blueprint from './components/blueprint'

const { Sider } = Layout

function Prototype() {
  // const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="prototype-main">
      <Layout style={{ height: '100%' }}>
        <Sider width="240" className="node-panel">
          <NodePanel />
        </Sider>
        <Layout>
          <Blueprint />
        </Layout>
      </Layout>
    </div>
  )
}

export default Prototype