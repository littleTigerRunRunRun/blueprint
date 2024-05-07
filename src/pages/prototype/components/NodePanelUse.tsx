import { PieChartOutlined, MergeOutlined, DeploymentUnitOutlined } from '@ant-design/icons'
import { StarmapNodeDefine } from '../components/blueprint/editor'

export type DraggingExec = (item:StarmapNodeDefine) => void

// 这个数据正常应该被持久化
const tabContentList:Record<
  string,
  Array<{
    typeName: string,
    theme: string,
    list: Array<StarmapNodeDefine>
  }>
> = {
  '1': [
    {
      typeName: 'sampleNode',
      theme: '#444444',
      list: [
        {
          name: 'pieChartSample',
          label: '饼图',
          define: {
            theme: 'gray',
            inputs: {},
            outputs: {},
            controls: {}
          }
        }
      ] 
    }
  ],
  '2': [
    {
      typeName: 'logicNode',
      theme: '#009EF1',
      list: [
        {
          name: 'ifJudgement',
          label: '分支判断',
          define: {
            theme: 'blue',
            inputs: {},
            outputs: {},
            controls: {}
          }
        }
      ] 
    }
  ],
  '3': [
    {
      typeName: 'nodeCombination',
      theme: '#F1A900',
      list: [
        {
          name: 'customCombination1',
          label: '用户自定义逻辑组合1',
          define: {
            theme: 'orange',
            inputs: {},
            outputs: {},
            controls: {}
          }
        }
      ] 
    }
  ]
}

const createTabChildren = (key:string, execDragStart: DraggingExec) => {
  return tabContentList[key].map((list, li) => {
    return <div className="node-list" key={`node_list_${li}`}>
      {
        list.list.map((item, ii) => {
          return <div
            className="node-item"
            style={{ backgroundColor: list.theme }}
            key={`node_item_${li}_${ii}`}
            onMouseDown={() => execDragStart(item)}
          >{ item.label }</div>
        })
      }
    </div>
  })
}

export function createTabs(execDragStart: DraggingExec) {
  return [
    {
      label: '实例节点',
      key: '1',
      icon: <PieChartOutlined />,
      children: createTabChildren('1', execDragStart)
    },
    {
      label: '逻辑节点',
      key: '2',
      icon: <MergeOutlined />,
      children: createTabChildren('2', execDragStart)
    },
    {
      label: '逻辑组合',
      key: '3',
      icon: <DeploymentUnitOutlined />,
      children: createTabChildren('3', execDragStart)
    }
  ]
}