import {
  ImportOutlined,
  ExportOutlined,
  RestOutlined,
  BorderOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { GraphExec, GraphNodeType, type DataFlowNode } from './editor'

// 工具栏配置
export const toolbarList = [
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
    icon: RestOutlined
  }
]

export const assetNode: Record<GraphNodeType, DataFlowNode> = {
  [GraphNodeType.START]: {
    name: 'start',
    label: '开始',
    width: 60,
    height: 60
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
    height: 50
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
