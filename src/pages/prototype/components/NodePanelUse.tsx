import {
  PieChartOutlined,
  MergeOutlined,
  DeploymentUnitOutlined,
  ApiOutlined,
  NumberOutlined,
  JavaScriptOutlined,
  MessageOutlined,
  ToolOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import { DraggingExec, tabContentList } from './nodeDefine'

const instanceCounter:Record<string, { num: number, setNum: React.Dispatch<React.SetStateAction<number>>}> = {}

export const checkInstanceNumChange = (name:string, change:number) => {
  const state = instanceCounter[name]
  if (state) {
    state.setNum(state.num + change)
  }
}

const createTabChildren = (key:string, execDragStart: DraggingExec) => {
  return tabContentList[key].map((list, li) => {
    return <div className="node-list" key={`node_list_${li}`}>
      {
        list.list.map((item, ii) => {
          if (typeof item.instanceNum === 'number') {
            const [num, setNum] = useState<number>(item.instanceNum)
            instanceCounter[item.name] = { num, setNum }
            return <div
              className={`node-item ${num === 0 ? 'disabled' : ''}`}
              style={{ backgroundColor: list.background }}
              key={`node_item_${li}_${ii}`}
              onMouseDown={() => execDragStart(item)}
            >{ item.label }</div>
          } else {
            return <div
              className="node-item"
              style={{ backgroundColor: list.background }}
              key={`node_item_${li}_${ii}`}
              onMouseDown={() => execDragStart(item)}
            >{ item.label }</div>
          }
        })
      }
    </div>
  })
}

export function createTabs(execDragStart: DraggingExec) {
  return [
    {
      label: '图形节点',
      key: 'graphic',
      icon: <PieChartOutlined />,
      children: createTabChildren('graphic', execDragStart)
    },
    {
      label: '数据处理',
      key: 'dataDeal',
      icon: <ApiOutlined />,
      children: createTabChildren('dataDeal', execDragStart)
    },
    {
      label: '流程控制',
      key: 'flowControl',
      icon: <MergeOutlined />,
      children: createTabChildren('flowControl', execDragStart)
    },
    {
      label: '全局事件',
      key: 'globalEvent',
      icon: <MessageOutlined />,
      children: createTabChildren('globalEvent', execDragStart)
    },
    // ApiOutlined: 转换
    // DeploymentUnitOutlined: 组合
    // NumberOutlined: #
    // JavaScriptOutlined: JS
    // MessageOutlined: 聊天气泡
    // PlusOutlined: +
    // ToolOutlined: 扳手
  ]
}