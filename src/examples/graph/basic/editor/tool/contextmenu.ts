import type { Item, Items } from 'rete-context-menu-plugin/_types/types'
import { type GraphExecCallback, type Schemes, GraphExec, GraphLineType } from '../define'
import { subscriber } from '../tool/Subscriber'

// declare interface GraphCMItem extends Item {
//   key: GraphExec
//   subitems?: GraphCMItem[];
// }

// 右键菜单功能定义
const deleteItem:Item = {
  label: '删除',
  key: GraphExec.DELETE_SELECT,
  handler() {
    subscriber.get('exec')?.[GraphExec.DELETE_SELECT]()
  }
}
// to do: 整体方向变化，不做布局改动

// 添加子节点可以选择方向
const addNextNode:Item = {
  label: '添加子节点',
  key: GraphExec.ADD_NODE_FROM_SELECTING,
  handler() {
    console.log('add next node')
  },
  subitems: [
    {
      label: '右侧添加',
      key: GraphExec.ADD_NODE_FROM_SELECTING,
      handler() {
        subscriber.get('exec')?.[GraphExec.ADD_NODE_FROM_SELECTING]('r')
      }
    },
    {
      label: '左侧添加',
      key: GraphExec.ADD_NODE_FROM_SELECTING,
      handler() {
        subscriber.get('exec')?.[GraphExec.ADD_NODE_FROM_SELECTING]('l')
      }
    },
    {
      label: '上方添加',
      key: GraphExec.ADD_NODE_FROM_SELECTING,
      handler() {
        subscriber.get('exec')?.[GraphExec.ADD_NODE_FROM_SELECTING]('t')
      }
    },
    {
      label: '下方添加',
      key: GraphExec.ADD_NODE_FROM_SELECTING,
      handler() {
        subscriber.get('exec')?.[GraphExec.ADD_NODE_FROM_SELECTING]('b')
      }
    },
  ]
}

const setLinesType:Item = {
  label: '设置线型（暂无）',
  key: GraphExec.SET_LINE,
  handler() {},
  subitems: [
    {
      label: '直线',
      key: GraphExec.SET_LINE,
      status: () => subscriber.get('line').type === GraphLineType.STRAIGHT,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'type', param: GraphLineType.STRAIGHT })
      }
    },
    {
      label: '折线',
      key: GraphExec.SET_LINE,
      status: () => subscriber.get('line').type === GraphLineType.MANHATTAN,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'type', param: GraphLineType.MANHATTAN })
      }
    },
    {
      label: '曲线',
      key: GraphExec.SET_LINE,
      status: () => subscriber.get('line').type === GraphLineType.CURVE,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'type', param: GraphLineType.CURVE })
      }
    },
    {
      label: '聚合曲线',
      key: GraphExec.SET_LINE,
      status: () => subscriber.get('line').type === GraphLineType.CLUSTERCURVE,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'type', param: GraphLineType.CLUSTERCURVE })
      }
    },
    {
      label: '聚合折线',
      key: GraphExec.SET_LINE,
      status: () => subscriber.get('line').type === GraphLineType.CLUSTERMANHATTAN,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'type', param: GraphLineType.CLUSTERMANHATTAN })
      }
    },
  ]
}

const setLinesFlow:Item = {
  label: '设置流动（暂无）',
  key: GraphExec.SET_LINE,
  handler() {},
  subitems: [
    {
      label: '是',
      key: GraphExec.SET_LINE,
      status: () => !!subscriber.get('line').flow,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'flow', param: true })
      }
    },
    {
      label: '否',
      key: GraphExec.SET_LINE,
      status: () => !subscriber.get('line').flow,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'flow', param: false })
      }
    }
  ]
}

const setLineArrow:Item = {
  label: '设置箭头（暂无）',
  key: GraphExec.SET_LINE,
  handler() {},
  subitems: [
    {
      label: '是',
      key: GraphExec.SET_LINE,
      status: () => !!subscriber.get('line').arrow,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'arrow', param: true })
      }
    },
    {
      label: '否',
      key: GraphExec.SET_LINE,
      status: () => !subscriber.get('line').arrow,
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_LINE]({ attr: 'arrow', param: false })
      }
    }
  ]
}

const switchDirection:Item = {
  label: '整体方向',
  key: GraphExec.SET_DIRECTION,
  handler() {},
  subitems: [
    {
      label: '向上',
      key: GraphExec.SET_DIRECTION,
      status: () => subscriber.get('direction') === 't',
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_DIRECTION]('t')
      }
    },
    {
      label: '向下',
      key: GraphExec.SET_DIRECTION,
      status: () => subscriber.get('direction') === 'b',
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_DIRECTION]('b')
      }
    },
    {
      label: '向左',
      key: GraphExec.SET_DIRECTION,
      status: () => subscriber.get('direction') === 'l',
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_DIRECTION]('l')
      }
    },
    {
      label: '向右',
      key: GraphExec.SET_DIRECTION,
      status: () => subscriber.get('direction') === 'r',
      handler() {
        subscriber.get('exec')?.[GraphExec.SET_DIRECTION]('r')
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

const createGroup:Item = {
  label: '聚合成组',
  key: GraphExec.CREATE_GROUP,
  handler() {
    subscriber.get('exec')?.[GraphExec.CREATE_GROUP]()
  }
}

const splitGroup:Item = {
  label: '拆分组合',
  key: GraphExec.SPLIT_GROUP,
  handler() {
    subscriber.get('exec')?.[GraphExec.SPLIT_GROUP]()
  }
}

export const CMItems:Items<Schemes> = (context:any, plugin:any) => {
  if (context === 'root') {
    return {
      searchBar: false,
      list: [reArrange, setLinesType, setLinesFlow, setLineArrow, switchDirection]
    }
  } else {
    if (context.id && subscriber.get('connectionSelector').selectableNodes) {
      subscriber.get('connectionSelector').selectableNodes.select(context.id, true)
    }
    if (context.name === 'node') {
      return {
        searchBar: false,
        list: [deleteItem, addNextNode, createGroup]
      }
    } else if (context.name === 'group') {
      return {
        searchBar: false,
        list: [splitGroup]
      }
    } else return {
      searchBar: false,
      list: [deleteItem]
    }
  }
}