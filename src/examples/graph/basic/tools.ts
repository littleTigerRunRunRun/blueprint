import { type FunctionalComponent, ref, type Ref } from 'vue'
import {
  ImportOutlined,
  ExportOutlined,
  RestOutlined,
  BorderOutlined,
  LoginOutlined,
  LogoutOutlined,
  MinusOutlined,
  RollbackOutlined,
  Loading3QuartersOutlined,
  RiseOutlined,
  DashOutlined,
  DoubleRightOutlined
} from '@ant-design/icons-vue'
import { GraphExec, GraphLineType, GraphNodeType, type GraphLineParamsObject, type RawDataFlowNode } from './editor'
import { subscriber } from './editor'

// 工具栏配置
export const toolbarList:Array<{
  name: GraphExec,
  label: string,
  icon: any, // FunctionalComponent | Ref<FunctionalComponent>,
  value?: any
  params?: Array<{ value: any, label: string, icon: FunctionalComponent }>
  split?: boolean
}> = [
  {
    name: GraphExec.IMPORT,
    label: '导入',
    icon: ImportOutlined
  },
  {
    name: GraphExec.EXPORT,
    label: '导出',
    icon: ExportOutlined
  },
  {
    name: GraphExec.CLEAR,
    label: '清空',
    icon: RestOutlined,
    split: true
  },
  {
    name: GraphExec.SET_LINE,
    label: '设置线型',
    icon: ref(RollbackOutlined),
    params: [
      { label: '直线', icon: MinusOutlined, value: { attr: 'type', param: GraphLineType.STRAIGHT } },
      { label: '曲线', icon: Loading3QuartersOutlined, value: { attr: 'type', param: GraphLineType.CURVE } },
      { label: '折线', icon: RollbackOutlined, value: { attr: 'type', param: GraphLineType.MANHATTAN } }
    ]
  },
  {
    name: GraphExec.SET_LINE,
    label: '设置箭头',
    icon: ref(MinusOutlined),
    params: [
      { label: '有箭头', icon: RiseOutlined, value: { attr: 'arrow', param: true } },
      { label: '无箭头', icon: MinusOutlined, value: { attr: 'arrow', param: false } },
    ]
  },
  {
    name: GraphExec.SET_LINE,
    label: '设置虚实',
    icon: ref(MinusOutlined),
    params: [
      { label: '实线', icon: MinusOutlined, value: { attr: 'solid', param: true } },
      { label: '虚线', icon: DashOutlined, value: { attr: 'solid', param: false } }
    ]
  },
  {
    name: GraphExec.SET_LINE,
    label: '设置流动',
    icon: ref(MinusOutlined),
    params: [
      { label: '流动（会被强制设定成虚线）', icon: DoubleRightOutlined, value: { attr: 'flow', param: true } },
      { label: '固定', icon: MinusOutlined, value: { attr: 'flow', param: false } }
    ]
  }
]

subscriber.listen('SELECT_LINE', (line:GraphLineParamsObject) => {
  const type = toolbarList.find((tool) => tool.label === '设置线型')
  if (type) {
    type.icon.value = type.params?.find((par) => par.value.param === line.type)?.icon
  }

  const arrow = toolbarList.find((tool) => tool.label === '设置箭头')
  if (arrow) {
    arrow.icon.value = arrow.params?.find((par) => par.value.param === line.arrow)?.icon
  }

  const solid = toolbarList.find((tool) => tool.label === '设置虚实')
  if (solid) {
    solid.icon.value = solid.params?.find((par) => par.value.param === line.solid)?.icon
  }

  const flow = toolbarList.find((tool) => tool.label === '设置流动')
  if (flow) {
    flow.icon.value = flow.params?.find((par) => par.value.param === line.flow)?.icon
  }
})

export const assetNode: Record<GraphNodeType, RawDataFlowNode> = {
  [GraphNodeType.START]: {
    name: 'start',
    label: '开始',
    width: 40,
    height: 40
  },
  [GraphNodeType.END]: {
    name: 'end',
    label: '结束',
    width: 40,
    height: 40
  },
  [GraphNodeType.NODE]: {
    name: 'node',
    label: '新建节点',
    width: 100,
    height: 40
  }
}

export const assetsList: Array<{
  name: GraphNodeType
  label: string
  icon: any
}> = [
  {
    name: GraphNodeType.START,
    label: '开始点',
    icon: LogoutOutlined
  },
  {
    name: GraphNodeType.END,
    label: '结束点',
    icon: LoginOutlined
  },
  {
    name: GraphNodeType.NODE,
    label: '节点',
    icon: BorderOutlined
  }
]
