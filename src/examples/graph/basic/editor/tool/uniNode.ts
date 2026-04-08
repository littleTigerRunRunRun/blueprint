// retejs里的节点，有很多可以配置的内容，这导致其自动化生成的方法，有些复杂，这里我们需要用一个函数，来描述这个节点的类型，以及返回对应的类
// 统一化节点，用一种统一数据结构描述多种节点

import { ClassicPreset, getUID } from 'rete'
import { GSDataType, GSFlowType } from '../define'

// 这个数组表示能够被加入内容的容器节点，这个部分是和我自己fork过的scope-plugin一起解决这个插件开启后任何节点都能相互嵌套的问题
const canUseAsParent: Array<string> = []
export const scopeElder = (nodeId: string) => {
  return canUseAsParent.includes(nodeId)
}

export class UniSocket extends ClassicPreset.Socket {
  constructor(
    name:string,
    public dataType: GSDataType = GSDataType.ANY, // 默认情况为任意类型
    public flowType: GSFlowType = GSFlowType.UNI // 默认情况为通用类型
  ) {
    super(name)
  }
}

// const nodeList:Record<string, true> = {}

export type UniNodeConfig = {
  id?: string
  name: string
  label: string
  width: number
  height: number
  // parent和nest是一组相关参数
  parent?: string
  nest?: boolean
  dataOperation?: (
    inputs: Record<string, Array<unknown>>,
    self: UniNode
  ) => { [key: string]: unknown }
  executeOperation?: (forward: (output: string) => void, self: UniNode) => void
}

// 通用节点
export class UniNode extends ClassicPreset.Node<
  Record<string, UniSocket>,
  Record<string, UniSocket>,
  Record<string, ClassicPreset.Control>
> {
  name: string
  width: number
  height: number
  nest?: boolean
  parent?: string
  sockets = ['t', 'r', 'b', 'l'] // 连线连接点
  dataOperation?: (
    inputs: Record<string, Array<unknown>>,
    self: UniNode
  ) => { [key: string]: unknown }
  executeOperation?: (forward: (output: string) => void, self: UniNode) => void
  constructor({
    id,
    label,
    name,
    width = 180,
    height = 150,
    nest,
    parent,
    dataOperation,
    executeOperation
  }: UniNodeConfig) {
    super(label)

    this.name = name
    if (id) this.id = id
    this.width = width
    this.height = height
    this.parent = parent
    this.dataOperation = dataOperation
    this.executeOperation = executeOperation
    if (nest) {
      this.nest = nest
      if (!canUseAsParent.includes(this.id)) canUseAsParent.push(this.id)
    }

    // 建立所属的连接点
    const input = new ClassicPreset.Input(new UniSocket('testInput'), '测试入口', true)
    this.addInput('testInput', input)

    const output = new ClassicPreset.Output(new UniSocket('testOutput'), '测试出口')
    this.addOutput('testOutput', output)
  }
  // data函数是retejs设计的数据流遍历的一环
  data(inputs: Record<string, Array<unknown>>): { [key: string]: unknown } {
    if (this.dataOperation) {
      const returnValue = this.dataOperation(inputs, this)

      return returnValue
    }
    return {}
  }
  // execute函数是retejs设计的控制流遍历的一环
  execute(_input: string, forward: (output: string) => void): void {
    if (this.executeOperation) this.executeOperation(forward, this)
  }
}

/* tslint:disable */
// tslint: disable: no-implicit-this
type createUniNodeFactor = {
  updateOutputControls?: (controlIds: Array<string>) => void
}

// 这一层的作用是通过闭包，生成一些效果不一样的工厂函数
export function getCreateUniNode(factor: createUniNodeFactor) {
  // if (node.executeOperation) {
  //   node.execute = (function(input:string, forward: (output:string) => void):void {
  //     // @ts-ignore 2683
  //     this.executeOperation(forward, this)
  //   }).bind(node)
  // }
  return function createUniNode(config: UniNodeConfig): UniNode {
    const node = new UniNode(config)
    return node
  }
}
