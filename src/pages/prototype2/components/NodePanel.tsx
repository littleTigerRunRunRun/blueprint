import { Tabs } from 'antd'
import './NodePanel.scss'
import { createTabs } from './NodePanelUse'
import { useEffect } from 'react'
import { StarmapNodeDefine } from '@/lib/blueprint/editor'

declare interface NodePanelProps {
  setDragging(item:StarmapNodeDefine|null):void
}

function NodePanel(props:NodePanelProps) {
  // const [collapsed, setCollapsed] = useState(false)
  const onDragStart = (item:StarmapNodeDefine) => {
    props.setDragging(item)
  }

  const onDragEnd = () => {
    props.setDragging(null)
  }
  document.body.addEventListener('mouseup', onDragEnd)
  document.body.addEventListener('mouseleave', onDragEnd)

  useEffect(() => {
    return () => {
      document.body.removeEventListener('mouseup', onDragEnd)
      document.body.removeEventListener('mouseleave', onDragEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tabs
      tabPosition="left"
      type="card"
      items={createTabs(onDragStart)}
      defaultActiveKey='1'
    />
  )
}

export default NodePanel