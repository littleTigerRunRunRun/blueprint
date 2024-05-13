import { PieChartOutlined, MergeOutlined, DeploymentUnitOutlined, ApiOutlined, NumberOutlined, JavaScriptOutlined, MessageOutlined } from '@ant-design/icons'
import type { StarmapNodeDefine } from '@/lib/blueprint/editor'
import { StarmapDataType, StarmapSocketType } from '@/lib/blueprint/editor'
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
                  socketType: StarmapSocketType.CONTROL,
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
                  socketType: StarmapSocketType.CONTROL,
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
                  socketType: StarmapSocketType.CONTROL
                },
                {
                  label: '隐藏',
                  name: 'hide',
                  type: 'input',
                  socketType: StarmapSocketType.CONTROL
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
                  socketType: StarmapSocketType.CONTROL
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
          label: '条件判断',
          theme: 'blue',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '判断条件',
                  name: 'judgement',
                  type: 'input',
                  socketType: StarmapSocketType.CONTROL,
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
                  socketType: StarmapSocketType.CONTROL
                },
                {
                  label: '假',
                  name: 'false',
                  type: 'output',
                  socketType: StarmapSocketType.CONTROL
                }
              ]
            }
          ]
        },
        // {
        //   name: 'stringSwitch',
        //   label: '分支判断(字符串)',
        //   theme: 'blue',
        //   category: [
        //     {
        //       align: 'left',
        //       content: [
        //         {
        //           label: '判断条件',
        //           name: 'judgement',
        //           type: 'input',
        //           socketType: StarmapSocketType.CONTROL,
        //           dataType: StarmapDataType.BOOLEAN
        //         }
        //       ]
        //     },
        //     {
        //       align: 'right',
        //       content: [
        //         {
        //           label: '真',
        //           name: 'true',
        //           type: 'output',
        //           socketType: StarmapSocketType.CONTROL
        //         },
        //         {
        //           label: '假',
        //           name: 'false',
        //           type: 'output',
        //           socketType: StarmapSocketType.CONTROL
        //         }
        //       ]
        //     }
        //   ]
        // }
      ] 
    }
  ],
  '3': [
    {
      typeName: 'transformerNode',
      theme: '#C77EFF',
      list: [
        {
          name: 'temp_transformer_1',
          label: '转换器：对象解析',
          theme: 'purple',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  socketType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.OBJECT
                }
              ]
            },
            {
              align: 'right',
              content: [
                {
                  label: '',
                  name: 'controlOut',
                  type: 'output',
                  socketType: StarmapSocketType.CONTROL
                },
                {
                  label: 'x',
                  name: 'value_1',
                  type: 'output',
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                },
                {
                  label: 'y',
                  name: 'value_2',
                  type: 'output',
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER
                },
                {
                  label: 'canDig',
                  name: 'value_3',
                  type: 'output',
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            }
          ]
        },
        {
          name: 'temp_transformer_1',
          label: '转换器：组合布尔控制',
          theme: 'purple',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '',
                  name: 'controlIn',
                  type: 'input',
                  socketType: StarmapSocketType.CONTROL
                },
                {
                  label: '输入',
                  name: 'controlValue',
                  type: 'input',
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            },
            {
              align: 'right',
              content: [
                {
                  label: '',
                  name: 'controlOut',
                  type: 'output',
                  socketType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            }
          ]
        },
        {
          name: 'temp_transformer_1',
          label: '转换器：组合字符串控制',
          theme: 'purple',
          category: [
            {
              align: 'left',
              content: [
                {
                  label: '',
                  name: 'controlIn',
                  type: 'input',
                  socketType: StarmapSocketType.CONTROL
                },
                {
                  label: '输入',
                  name: 'controlValue',
                  type: 'input',
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                }
              ]
            },
            {
              align: 'right',
              content: [
                {
                  label: '',
                  name: 'controlOut',
                  type: 'output',
                  socketType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        }
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
                  socketType: StarmapSocketType.CONTROL,
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
                  socketType: StarmapSocketType.DATA,
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
                  socketType: StarmapSocketType.CONTROL,
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
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '6': [
    {
      typeName: 'DataType',
      theme: '#F35353',
      list: [
        {
          name: 'string',
          label: '字符串',
          theme: 'red',
          category: [
            {
              align: 'right',
              content: [
                {
                  label: '""',
                  name: 'get',
                  type: 'output',
                  socketType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  '7': [
    {
      typeName: 'Event',
      theme: '#3DB900',
      list: [
        {
          name: 'mounted',
          label: '初始化完毕',
          theme: 'green',
          category: [
            {
              align: 'right',
              content: [
                {
                  label: '执行',
                  name: 'get',
                  type: 'output',
                  socketType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.NULL
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
    },
    {
      label: '数据类型',
      key: '6',
      icon: <JavaScriptOutlined />,
      children: createTabChildren('6', execDragStart)
    },
    {
      label: '全局事件',
      key: '7',
      icon: <MessageOutlined />,
      children: createTabChildren('7', execDragStart)
    }
  ]
}