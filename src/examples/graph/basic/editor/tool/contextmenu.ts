import type { Item, Items } from 'rete-context-menu-plugin/_types/types'
import { type GraphExecCallback, type Schemes, GraphExec, GraphLineType } from '../define'
import { global } from '../global'

// declare interface GraphCMItem extends Item {
//   key: GraphExec
//   subitems?: GraphCMItem[];
// }

// 右键菜单功能定义
const deleteItem:Item = {
  label: '删除',
  key: GraphExec.DELETE_SELECT,
  handler() {
    global.exec?.[GraphExec.DELETE_SELECT]()
  }
}
// to do: 整体方向变化，不做布局改动

// 添加子节点可以选择方向
// const addNextNode:Item = {
//   label: '添加子节点',
//   key: GraphExec.ADD_NODE,
//   handler() {
//     console.log('add next node')
//   },
//   subitems: [
//     {
//       label: '右侧添加',
//       key: GraphExec.ADD_NODE,
//       handler() {
//         console.log('add next right node')
//       }
//     }
//   ]
// }

const setLinesType:Item = {
  label: '设置线型',
  key: GraphExec.SET_LINE,
  handler() {},
  subitems: [
    {
      label: '直线',
      key: GraphExec.SET_LINE,
      status: () => global.lineType === GraphLineType.STRAIGHT,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('type', GraphLineType.STRAIGHT)
      }
    },
    {
      label: '折线',
      key: GraphExec.SET_LINE,
      status: () => global.lineType === GraphLineType.MANHATTAN,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('type', GraphLineType.MANHATTAN)
      }
    },
    {
      label: '曲线',
      key: GraphExec.SET_LINE,
      status: () => global.lineType === GraphLineType.CURVE,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('type', GraphLineType.CURVE)
      }
    },
    {
      label: '聚合曲线',
      key: GraphExec.SET_LINE,
      status: () => global.lineType === GraphLineType.CLUSTERCURVE,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('type', GraphLineType.CLUSTERCURVE)
      }
    },
    {
      label: '聚合折线',
      key: GraphExec.SET_LINE,
      status: () => global.lineType === GraphLineType.CLUSTERMANHATTAN,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('type', GraphLineType.CLUSTERMANHATTAN)
      }
    },
  ]
}

const setLinesFlow:Item = {
  label: '设置流动',
  key: GraphExec.SET_LINE,
  handler() {},
  subitems: [
    {
      label: '是',
      key: GraphExec.SET_LINE,
      status: () => !!global.lineFlow,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('flow', true)
      }
    },
    {
      label: '否',
      key: GraphExec.SET_LINE,
      status: () => !global.lineFlow,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('flow', false)
      }
    }
  ]
}

const setLineArrow:Item = {
  label: '设置箭头',
  key: GraphExec.SET_LINE,
  handler() {},
  subitems: [
    {
      label: '是',
      key: GraphExec.SET_LINE,
      status: () => !!global.lineArrow,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('arrow', true)
      }
    },
    {
      label: '否',
      key: GraphExec.SET_LINE,
      status: () => !global.lineArrow,
      handler() {
        global.exec?.[GraphExec.SET_LINE]('arrow', false)
      }
    }
  ]
}

const reArrange:Item = {
  label: '优化布局',
  key: GraphExec.REARRANGE,
  handler() {
    console.log('rearrange')
  }
}

export const CMItems:Items<Schemes> = (context:any, plugin:any) => {
  if (context === 'root') {
    return {
      searchBar: false,
      list: [reArrange, setLinesType, setLinesFlow, setLineArrow]
    }
  } else {
    if (context.id && global.connectionSelector.selectableNodes) {
      global.connectionSelector.selectableNodes.select(context.id, false)
    }
    if (context.name === 'node') {
      return {
        searchBar: false,
        // addNextNode, 
        list: [deleteItem]
      }
    } else return {
      searchBar: false,
      list: [deleteItem]
    }
  }
}