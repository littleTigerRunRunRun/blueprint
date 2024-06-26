// 当Port存在格式问题时，就需要中间格式转换节点
import { StarmapDataType, StarmapNodeDefine, StarmapSocketType } from '../define'

const TRANSFORMER_THEME_NAME = 'purple'

const StarmapDataTypeLabelMapping = {
  [StarmapDataType.STRING]: '字符',
  [StarmapDataType.NUMBER]: '数字',
  [StarmapDataType.BOOLEAN]: '布尔',
  [StarmapDataType.OBJECT]: '对象',
  [StarmapDataType.ARRAY]: '数组',
  [StarmapDataType.UNKNOW]: '未知',
  [StarmapDataType.NULL]: '空'
}

/**
 * 对于from to to的情况
 * string to number: to = parseFloat(from)
 * number to string: to = `${from}`
 */

// 生成格式转换节点
export function createTransformer(from: {
  dataType: StarmapDataType,
  flowType: StarmapSocketType
}, to: {
  dataType: StarmapDataType,
  flowType: StarmapSocketType
}):{
  inputName: string
  outputName: string
  transformer: StarmapNodeDefine
} {
  return {
    inputName: 'input',
    outputName: 'output',
    transformer: {
      name: `transformer_${from}_${to}`,
      label: `${StarmapDataTypeLabelMapping[from.dataType]}转为${StarmapDataTypeLabelMapping[to.dataType]}`,
      theme: TRANSFORMER_THEME_NAME,
      category: [
        {
          align: 'left',
          content: [
            {
              label: '输入',
              name: 'input',
              type: 'input',
              dataType: from.dataType,
              flowType: from.flowType
            }
          ]
        },
        {
          align: 'right',
          content: [
            {
              label: '输出',
              name: 'output',
              type: 'output',
              dataType: to.dataType,
              flowType: to.flowType
            }
          ]
        }
      ]
    }
  }
}