// changelog: 
// 0.0.1: 为节点添加了可以设置父子级关系的能力，为节点添加了可以定义类型的方法
// 0.0.3: UniNode不再直接具备inputs、outputs、controls，而改为一个描述了带有input、output、control三种内容的内容序列，并且取消了UniNode需要的类型参数

import { ClassicPreset } from 'rete'
import { StarmapNodeCategory, StarmapSocket, StarmapDataType } from './define'

export class UniSocket extends ClassicPreset.Socket {
  public type: StarmapDataType
  constructor(name:string, type?: StarmapDataType) {
    super(name)

    this.type = type || StarmapDataType.UNKNOW
  }
}

// const socket = new UniSocket('socket')

// retejs里的节点，有很多可以配置的内容，这导致其自动化生成的方法，有些复杂，这里我们需要用一个函数，来描述这个节点的类型，以及返回对应的类
// 统一化节点，用一种统一数据结构描述多种节点


// 这个数组表示能够被加入内容的容器节点，这个部分是和我自己fork过的scope-plugin一起解决这个插件开启后任何节点都能相互嵌套的问题
const canUseAsParent:Array<string> = []
export const scopeElder = (nodeId:string) => {
  return canUseAsParent.includes(nodeId)
}

export type UniNodeConfig = {
  nodeId?:string
  label:string
  type?:string
  theme?:string
  hasChildren?:boolean
  width:number
  height:number // todo:更希望高度可以传入一个计算标准来自适应计算
  category:StarmapNodeCategory
  dataOperation?:(inputs: Record<string, Array<unknown>>, self:UniNode) => { [key:string]: unknown }
  executeOperation?:(forward: (output:string) => void, self:UniNode) => void
}

export class UniNode extends ClassicPreset.Node<
  Record<string, StarmapSocket>,
  Record<string, StarmapSocket>,
  Record<string, ClassicPreset.InputControl<'number'|'text'>>
>{
  nodeId?:string
  width:number
  height:number
  type?:string
  hasChildren:boolean = false
  parent?:string
  theme:string = ''
  category:StarmapNodeCategory
  updateOutputControls?:(controlIds:Array<string>) => void
  dataOperation?:(inputs: Record<string, Array<unknown>>, self:UniNode) => { [key:string]: unknown }
  executeOperation?:(forward: (output:string) => void, self:UniNode) => void
  inputKeys:Array<string> = []
  outputKeys:Array<string> = []
  controlKeys:Array<string> = []
  constructor({ nodeId, label, width = 180, height = 150, type, theme, hasChildren, category, dataOperation, executeOperation }:UniNodeConfig) {
    super(label)

    this.nodeId = nodeId || this.id
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
      item.content.forEach((element) => {
        switch(element.type) {
          case 'input':{
            this.inputKeys.push(element.name)
            const input = new ClassicPreset.Input(new UniSocket(element.name), element.label)
            // 需要一个中间件来解决element.control.type的匹配问题
            if (element.control) input.addControl(new ClassicPreset.InputControl<'number'|'text'>('number', { initial: element.control.initial, change: element.control.change, readonly: element.control.readonly }))
            this.addInput(element.name, input)
            break
          }
          case 'output':{
            this.outputKeys.push(element.name)
            if (element.control) this.addControl(element.name, new ClassicPreset.InputControl<'number'|'text'>('number', { initial: element.control.initial, readonly: element.control.readonly, change: element.control.change }))
            this.addOutput(element.name, new ClassicPreset.Output(new UniSocket(element.name), element.label))
            break
          }
          case 'control':{
            this.controlKeys.push(element.name)
            this.addControl(element.name, new ClassicPreset.InputControl<'number'|'text'>('number', { initial: element.control.initial, readonly: element.control.readonly, change: element.control.change }))
            break
          }
        }
      })
    })
  }
  data(inputs: Record<string, Array<unknown>>):{ [key:string]: unknown } {
    if (this.dataOperation) {
      const returnValue = this.dataOperation(inputs, this)
      if (this.updateOutputControls) this.updateOutputControls(this.outputKeys.filter((key:string) => !!this.controls[key]).map((id) => this.controls[id].id))
  
      return returnValue
    }
    return {}
  }
  execute(input:string, forward: (output:string) => void):void {
    if (this.executeOperation) this.executeOperation(forward, this)
  }
}

/* tslint:disable */
// tslint: disable: no-implicit-this
type createUniNodeFactor = {
  updateOutputControls?:(controlIds:Array<string>) => void
}

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