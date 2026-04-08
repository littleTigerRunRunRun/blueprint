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

const setLines:Item = {
  label: '设置线型',
  key: GraphExec.SET_LINE_TYPE,
  handler() {},
  subitems: [
    {
      label: '直线',
      key: GraphExec.SET_LINE_TYPE,
      handler() {
        global.exec?.[GraphExec.SET_LINE_TYPE](GraphLineType.STRAIGHT)
      }
    },
    {
      label: '折线',
      key: GraphExec.SET_LINE_TYPE,
      handler() {
        global.exec?.[GraphExec.SET_LINE_TYPE](GraphLineType.MANHATTAN)
      }
    },
    {
      label: '曲线',
      key: GraphExec.SET_LINE_TYPE,
      handler() {
        global.exec?.[GraphExec.SET_LINE_TYPE](GraphLineType.CURVE)
      }
    },
    {
      label: '聚合曲线',
      key: GraphExec.SET_LINE_TYPE,
      handler() {
        global.exec?.[GraphExec.SET_LINE_TYPE](GraphLineType.CLUSTERCURVE)
      }
    },
    {
      label: '聚合折线',
      key: GraphExec.SET_LINE_TYPE,
      handler() {
        global.exec?.[GraphExec.SET_LINE_TYPE](GraphLineType.CLUSTERMANHATTAN)
      }
    },
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
      list: [reArrange, setLines]
    }
  } else {
    if (context.id && global.connectionSelector.selectableNodes) {
      global.connectionSelector.selectableNodes.select(context.id, false)
    }
    return {
      searchBar: false,
      list: [deleteItem]
    }
  }
}