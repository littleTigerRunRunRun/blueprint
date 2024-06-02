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
          label: '数学运算',
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
                    type: StarmapControlType.SELECT
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