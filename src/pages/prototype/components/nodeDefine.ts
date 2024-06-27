import type { StarmapNodeDefine, StarmapNodeCategory } from '@/lib/blueprint/editor'
import { StarmapControlType, StarmapDataType, StarmapSocketType } from '@/lib/blueprint/editor'
import { categoryComponent } from './nodeDefineComponent'

export type DraggingExec = (item:StarmapNodeDefine) => void

// 这个数据正常应该被持久化
const rawTabContentList:Record<
  string,
  Array<{
    background: string,
    list: Array<{
      id?:string
      instanceNum?: number
      name: string
      label: string
      theme: string
      category: Array<StarmapNodeCategory | string>
      nest?: Array<StarmapNodeCategory | string>
    }>
  }>
> = {
  graphic: [
    {
      background: '#444444',
      list: [
        {
          name: 'fan',
          label: '扇形',
          theme: 'gray',
          category: [
            'Instantiate',
            'Centre',
            'Arc',
            'Radius',
            'Fill',
            'Stroke'
          ]
        },
        {
          name: 'text',
          label: '文字',
          theme: 'gray',
          category: [
            'Instantiate',
            'Position',
            'Fill',
            'Font'
          ]
        }
      ]
    }
  ],
  dataDeal: [
    {
      background: '#009EF1',
      list: [
        {
          name: 'objectParser',
          label: '对象解析',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.OBJECT
                }
              ]
            }
          ]
        },
        {
          name: 'objectGenerator',
          label: '对象生成',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.OBJECT
                }
              ]
            }
          ]
        },
        {
          name: 'Mathematical',
          label: '四则运算',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入一',
                  name: 'input1',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER
                },
                {
                  label: '输入二',
                  name: 'input2',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER
                },
                {
                  label: '操作符',
                  name: 'operator',
                  type: 'control',
                  control: {
                    type: StarmapControlType.SELECT,
                    options: [
                      { value: '+', label: '加法' },
                      { value: '-', label: '减法' },
                      { value: '*', label: '乘法' },
                      { value: '/', label: '除法' },
                      // { value: 'ln', label: '对数' },
                      // { value: 'sqrt', label: '平方根' },
                      // { value: 'Abs', label: '绝对值' },
                    ]
                  }
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER
                }
              ]
            }
          ]
        },
        {
          name: 'Compare',
          label: '比较',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入一',
                  name: 'input1',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER
                },
                {
                  label: '输入二',
                  name: 'input2',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER,
                  control: {
                    type: StarmapControlType.INPUTNUMBER
                  }
                },
                {
                  label: '操作符',
                  name: 'operator',
                  type: 'control',
                  control: {
                    type: StarmapControlType.SELECT,
                    options: [
                      { value: '>', label: '大于' },
                      { value: '<', label: '小于' },
                      { value: '<=', label: '小于等于' },
                      { value: '>=', label: '大于等于' },
                      { value: '==', label: '等于' },
                      { value: '!=', label: '不等于' }
                    ]
                  }
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            }
          ]
        },
        {
          name: 'Contain',
          label: '包含',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.UNKNOW
                  // 这个类型刚进来时输入是UNKNOW，但是接入检测列表后需要能检测出包含的输入类型
                },
                {
                  label: '检测列表',
                  name: 'list',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            }
          ]
        },
        {
          // 需要做容器
          name: 'Sort',
          label: '排序',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                }
              ]
            }
          ]
        },
        {
          // 需要做容器
          name: 'Filter',
          label: '过滤',
          theme: 'blue',
          category: [
            {
              label: '',
              halfline: true,
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                }
              ]
            },
            {
              label: '',
              halfline: true,
              content: [
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                }
              ]
            }
          ],
          nest: [
            {
              label: '',
              halfline: true,
              content: [
                {
                  label: '过滤函数',
                  name: 'inner_excute',
                  type: 'output',
                  flowType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.NULL
                },
                {
                  label: '项',
                  name: 'inner_item',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.UNKNOW
                },
                {
                  label: '序号',
                  name: 'inner_index',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.NUMBER
                }
              ]
            },
            {
              label: '',
              halfline: true,
              content: [
                {
                  label: '输出',
                  name: 'inner_output',
                  type: 'input',
                  flowType: StarmapSocketType.CONTROL,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            }
          ]
        },
        {
          name: 'RegExp',
          label: '正则表达式',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                },
                {
                  label: '正则表达式',
                  name: 'input',
                  type: 'control',
                  control: {
                    type: StarmapControlType.INPUT,
                    placeholder: '正则表达式'
                  }
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        },
        {
          name: 'Join',
          label: '字符串拼接',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                },
                {
                  label: '分隔符',
                  name: 'input',
                  type: 'control',
                  control: {
                    type: StarmapControlType.INPUT,
                    placeholder: '分隔符'
                  }
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                }
              ]
            }
          ]
        },
        {
          name: 'Split',
          label: '字符串分割',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.STRING
                },
                {
                  label: '分隔符',
                  name: 'input',
                  type: 'control',
                  control: {
                    type: StarmapControlType.INPUT,
                    placeholder: '分隔符'
                  }
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.ARRAY
                }
              ]
            }
          ]
        },
        {
          name: 'Assert',
          label: '未知类型断言',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.UNKNOW
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.UNKNOW
                }
              ]
            }
          ]
        },
        {
          name: 'NullJudge',
          label: '空值判断',
          theme: 'blue',
          category: [
            {
              label: '',
              content: [
                {
                  label: '输入',
                  name: 'input',
                  type: 'input',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.UNKNOW
                },
                {
                  label: '输出',
                  name: 'output',
                  type: 'output',
                  flowType: StarmapSocketType.DATA,
                  dataType: StarmapDataType.BOOLEAN
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  flowControl: [
    {
      background: '#3DB900',
      list: []
    }
  ],
  globalEvent: [
    {
      background: '#F35353',
      list: []
    }
  ]
}

export const tabContentList:Record<
  string,
  Array<{
    background: string,
    list: Array<StarmapNodeDefine>
  }>
> = {}

for (const k1 in rawTabContentList) {
  const tab = []
  for (const item of rawTabContentList[k1]) {
    const list:Array<StarmapNodeDefine> = []
    for (const item2 of item.list) {
      const cate:StarmapNodeDefine = {
        name: '',
        label: '',
        theme: '',
        category: []
      }
      for (const key2 in item2) {
        if (key2 !== 'category') (cate as any)[key2] = (item2 as any)[key2]
        else item2.category.forEach((cateItem) => {
          if (typeof cateItem === 'string') {
            if (!categoryComponent[cateItem]) {
              console.error('no such category component:' + cateItem)
              return
            }
            cate.category.push(categoryComponent[cateItem])
          } else cate.category.push(cateItem)
        })
      }
      list.push(cate)
    }
    tab.push({
      background: item.background,
      list
    })
  }
  tabContentList[k1] = tab
}

console.log(tabContentList)