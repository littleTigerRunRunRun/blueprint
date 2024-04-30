import { PieChartOutlined, MergeOutlined, DeploymentUnitOutlined } from '@ant-design/icons'

const createTabChildren = (key:string) => {
  const tabContentList:Record<
    string,
    Array<{
      typeName: string,
      theme: string,
      list: Array<Record<string, string>>
    }>
  > = {
    '1': [
      {
        typeName: 'sampleNode',
        theme: '#444444',
        list: [
          {
            name: 'pieChartSample',
            label: '饼图实例'
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
            label: '分支判断'
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
            label: '用户自定义逻辑组合1'
          }
        ] 
      }
    ]
  }

        
  return  tabContentList[key].map((list, li) => {
    return <div className="node-list" key={`node_list_${li}`}>
      {
        list.list.map((item, ii) => {
          return <div
            className="node-item"
            style={{ backgroundColor: list.theme }}
            key={`node_item_${li}_${ii}`}
          >{ item.label }</div>
        })
      }
    </div>
  })
}

export const tabs = [
  {
    label: '实例节点',
    key: '1',
    icon: <PieChartOutlined />,
    children: createTabChildren('1')
  },
  {
    label: '逻辑节点',
    key: '2',
    icon: <MergeOutlined />,
    children: createTabChildren('2')
  },
  {
    label: '逻辑组合',
    key: '3',
    icon: <DeploymentUnitOutlined />,
    children: createTabChildren('3')
  }
]