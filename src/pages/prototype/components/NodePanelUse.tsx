import { PieChartOutlined, MergeOutlined, DeploymentUnitOutlined, ApiOutlined, NumberOutlined } from '@ant-design/icons'
import type { StarmapNodeDefine } from '../components/blueprint/editor'
import { createTransformer, StarmapDataType } from '../components/blueprint/editor'
import { useState } from 'react'

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
          name: 'pieChart_1',
          label: '饼图_1',
          theme: 'gray',
          instanceNum: 1,
          category: [
            {
              label: '动作',
              align: 'left',
              content: [
                {
                  label: '更新数据',
                  name: 'updateData',
                  type: 'input',
                  dataType: StarmapDataType.OBJECT
                }
              ]
            },
            {
              label: '事件',
              align: 'right',
              content: [
                {
                  label: '点击扇形',
                  name: 'clickItem',
                  type: 'output',
                  dataType: StarmapDataType.OBJECT
                }
              ]
            }
          ]
        },
        {
          name: 'button_1',
          label: '按钮_1',
          theme: 'gray',
          instanceNum: 1,
          category: [
            {
              label: '动作',
              align: 'left',
              content: [
                {
                  label: '显示',
                  name: 'show',
                  type: 'input',
                  dataType: StarmapDataType.NULL
                },
                {
                  label: '隐藏',
                  name: 'hide',
                  type: 'input',
                  dataType: StarmapDataType.NULL
                }
              ]
            },
            {
              label: '事件',
              align: 'right',
              content: [
                {
                  label: '点击按钮',
                  name: 'click',
                  type: 'output',
                  dataType: StarmapDataType.NULL
                }
              ]
            }
          ]
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
          theme: 'blue',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '判断条件',
                  name: 'judgement',
                  type: 'input',
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            },
            {
              align: 'right',
              content: [
                {
                  label: '真',
                  name: 'true',
                  type: 'output',
                  dataType: StarmapDataType.NULL
                },
                {
                  label: '假',
                  name: 'false',
                  type: 'output',
                  dataType: StarmapDataType.NULL
                }
              ]
            }
          ]
        }
      ] 
    }
  ],
  '3': [
    {
      typeName: 'transformerNode',
      theme: '#C77EFF',
      list: [
        createTransformer(StarmapDataType.NULL, StarmapDataType.ARRAY).transformer,
        createTransformer(StarmapDataType.NULL, StarmapDataType.OBJECT).transformer
      ] 
    }
  ],
  '4': [
    {
      typeName: 'nodeCombination',
      theme: '#F1A900',
      list: [
        {
          name: 'customCombination1',
          label: '用户自定义逻辑组合1',
          theme: 'orange',
          category: []
        }
      ] 
    }
  ],
  '5': [
    {
      typeName: 'Variable',
      theme: '#444444',
      list: [
        {
          name: 'variable_province',
          label: '变量_省份',
          theme: 'gray',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '设置',
                  name: 'set',
                  type: 'input',
                  dataType: StarmapDataType.STRING
                }
              ]
            },
            {
              align: 'right',
              content: [
                {
                  label: '获取',
                  name: 'get',
                  type: 'output',
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        },
        {
          name: 'variable_city',
          label: '变量_城市',
          theme: 'gray',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '设置',
                  name: 'set',
                  type: 'input',
                  dataType: StarmapDataType.STRING
                }
              ]
            },
            {
              align: 'right',
              content: [
                {
                  label: '获取',
                  name: 'get',
                  type: 'output',
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

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
              style={{ backgroundColor: list.theme }}
              key={`node_item_${li}_${ii}`}
              onMouseDown={() => execDragStart(item)}
            >{ item.label }</div>
          } else {
            return <div
              className="node-item"
              style={{ backgroundColor: list.theme }}
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
      label: '转换节点',
      key: '3',
      icon: <ApiOutlined />,
      children: createTabChildren('3', execDragStart)
    },
    {
      label: '逻辑组合',
      key: '4',
      icon: <DeploymentUnitOutlined />,
      children: createTabChildren('4', execDragStart)
    },
    {
      label: '变量',
      key: '5',
      icon: <NumberOutlined />,
      children: createTabChildren('5', execDragStart)
    }
  ]
}