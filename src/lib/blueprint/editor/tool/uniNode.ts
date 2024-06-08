// retejs里的节点，有很多可以配置的内容，这导致其自动化生成的方法，有些复杂，这里我们需要用一个函数，来描述这个节点的类型，以及返回对应的类
// 统一化节点，用一种统一数据结构描述多种节点

import { ClassicPreset, getUID } from 'rete'
import { StarmapNodeCategory, StarmapSocket, StarmapDataType, StarmapSocketType, StarmapControlType, StarmapControl } from '../define'

export class UniSocket extends ClassicPreset.Socket {
  constructor(
    name:string,
    public dataType: StarmapDataType = StarmapDataType.NULL,
    public flowType: StarmapSocketType = StarmapSocketType.DATA
  ) {
    super(name)
  }
}

export class UniControl extends ClassicPreset.Control {
  type: StarmapControlType
  value?: StarmapControl['initial']
  readonly: boolean
  constructor(public options: StarmapControl) {
    super()
    this.type = options.type
    this.id = getUID()
    this.readonly = options?.readonly || false

    // if (options?.initial && options.initial !== undefined) {
      
    // }
    this.value = options?.initial
  }

  /**
   * Set control value
   * @param value Value to set
   */
  setValue(value: never) {
    this.value = value
    if (this.options?.change) this.options.change(value)
  }
}

// 这个数组表示能够被加入内容的容器节点，这个部分是和我自己fork过的scope-plugin一起解决这个插件开启后任何节点都能相互嵌套的问题
const canUseAsParent:Array<string> = []
export const scopeElder = (nodeId:string) => {
  return canUseAsParent.includes(nodeId)
}

// const nodeList:Record<string, true> = {}

export type UniNodeConfig = {
  id?:string
  name:string
  label:string
  type?:string
  theme?:string
  hasChildren?:boolean
  width:number
  height:number // todo:更希望高度可以传入一个计算标准来自适应计算
  category:Array<StarmapNodeCategory>
  dataOperation?:(inputs: Record<string, Array<unknown>>, self:UniNode) => { [key:string]: unknown }
  executeOperation?:(forward: (output:string) => void, self:UniNode) => void
}

// 通用节点
export class UniNode extends ClassicPreset.Node<
  Record<string, StarmapSocket>,
  Record<string, StarmapSocket>,
  Record<string, UniControl>
> {
  outputs: Record<string, ClassicPreset.Input<StarmapSocket>> = {}
  name:string
  width:number
  height:number
  type?:string
  hasChildren:boolean = false
  parent?:string
  theme:string = ''
  category:Array<StarmapNodeCategory>
  updateOutputControls?:(controlIds:Array<string>) => void
  dataOperation?:(inputs: Record<string, Array<unknown>>, self:UniNode) => { [key:string]: unknown }
  executeOperation?:(forward: (output:string) => void, self:UniNode) => void
  inputKeys:Array<string> = []
  outputKeys:Array<string> = []
  controlKeys:Array<string> = []
  constructor({ id, label, name, width = 180, height = 150, type, theme, hasChildren, category, dataOperation, executeOperation }:UniNodeConfig) {
    super(label)

    // nodeList[this.id] = true

    this.name = name
    if (id) this.id = id
    this.width = width
    this.height = height
    this.type = type
    if (theme) this.theme = theme
    this.dataOperation = dataOperation
    this.executeOperation = executeOperation
    if (hasChildren) {
      this.hasChildren = true
      if (!canUseAsParent.includes(this.id)) canUseAsParent.push(this.id)
    }
    
    this.category = category
    // console.log('category', category)
    category.forEach((item) => {
      [...item.content, ...(item.extend?.content || [])].forEach((element) => {
        if (element.type === 'input' || element.type === 'both') {
          this.inputKeys.push(element.name)
          const input = new ClassicPreset.Input(new UniSocket(element.name), element.label, true)
          // 需要一个中间件来解决element.control.type的匹配问题
          if (element.control) input.addControl(new UniControl(element.control))
          this.addInput(element.name, input)
        }
        if (element.type === 'output' || element.type === 'both') {
          this.outputKeys.push(element.name)
          const output = new ClassicPreset.Input(new UniSocket(element.name), element.label, true)
          if (element.control) output.addControl(new UniControl(element.control))
          this.addOutput(element.name, output)
        }
        if (element.type === 'control') {
          this.controlKeys.push(element.name)
          this.addControl(element.name, new UniControl(element.control))
        }
      })
    })
  }
  // data函数是retejs设计的数据流遍历的一环
  data(inputs: Record<string, Array<unknown>>):{ [key:string]: unknown } {
    if (this.dataOperation) {
      const returnValue = this.dataOperation(inputs, this)
      if (this.updateOutputControls) this.updateOutputControls(this.outputKeys.filter((key:string) => !!this.controls[key]).map((id) => this.controls[id].id))
  
      return returnValue
    }
    return {}
  }
  // execute函数是retejs设计的控制流遍历的一环
  execute(_input:string, forward: (output:string) => void):void {
    if (this.executeOperation) this.executeOperation(forward, this)
  }
}

/* tslint:disable */
// tslint: disable: no-implicit-this
type createUniNodeFactor = {
  updateOutputControls?:(controlIds:Array<string>) => void
}

// 这一层的作用是通过闭包，生成一些效果不一样的工厂函数
export function getCreateUniNode(factor:createUniNodeFactor) {
  // if (node.executeOperation) {
  //   node.execute = (function(input:string, forward: (output:string) => void):void {
  //     // @ts-ignore 2683
  //     this.executeOperation(forward, this)
  //   }).bind(node)
  // }
  return function createUniNode(config:UniNodeConfig):UniNode {
    const node = new UniNode(config)
    if (factor.updateOutputControls) node.updateOutputControls = factor.updateOutputControls
    return node
  }
}