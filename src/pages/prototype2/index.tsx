import { useState } from 'react'
import { Layout } from 'antd'
import './index.scss'
import NodePanel from './components/NodePanel'
import { checkInstanceNumChange } from './components/NodePanelUse'
import Blueprint from '@/lib/blueprint'
import { StarmapNodeDefine } from '@/lib/blueprint/editor'

const { Sider } = Layout

function Prototype2() {
  // const [collapsed, setCollapsed] = useState(false)
  const [dragging, setDragging] = useState<StarmapNodeDefine|null>(null)

  return (
    <div className="prototype-main">
      <Layout style={{ height: '100%' }}>
        <Sider width="240" className="node-panel">
          <NodePanel setDragging={setDragging} />
        </Sider>
        <Layout>
          <Blueprint dragging={dragging} checkInstanceNumChange={checkInstanceNumChange} />
        </Layout>
      </Layout>
    </div>
  )
}

export default Prototype2