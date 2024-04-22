import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

// retejs里的节点，有很多可以配置的内容，这导致其自动化生成的方法，有些复杂，这里我们需要用一个函数，来描述这个节点的类型，以及返回对应的类
// 统一化节点，用一种统一数据结构描述多种节点

// 这个Socket类型需要能被扩展
export declare interface UniSocket<T extends 'text'|'number'>  {
  label: string
  control?:UniControl<T>
}

// 这个Control类型需要能被扩展
export declare interface UniControl<T extends 'text'|'number', N = T extends 'text' ? string : number> {
  type:T
  initial?:N
  readonly?:boolean
  change?:() => void
}

export interface UniNodeConfig<K extends 'number'|'text', N extends number | string, T extends UniSocket<K>, S extends UniControl<K>> {
  label:string
  width:number
  height:number // todo:更希望高度可以传入一个计算标准来自适应计算
  inputs:Record<string, T>
  outputs:Record<string, T>
  controls:Record<string, S>
  dataOperation?:(inputs: Record<string, Array<N>>, self:UniNode<K, N>) => { [key:string]: N }
  executeOperation?:(forward: (output:string) => void, self:UniNode<K, N>) => void
}

export class UniNode<T extends 'number'|'text', N extends number | string> extends ClassicPreset.Node<
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.InputControl<'number'|'text'>>
>{
  width:number
  height:number
  updateOutputControls?:(controlIds:Array<string>) => void
  dataOperation?:(inputs: Record<string, Array<N>>, self:UniNode<T, N>) => { [key:string]: N }
  executeOperation?:(forward: (output:string) => void, self:UniNode<T, N>) => void
  inputKeys:Array<string>
  outputKeys:Array<string>
  controlKeys:Array<string>
  constructor({ label, width = 180, height = 150, inputs, outputs, controls, dataOperation, executeOperation }:UniNodeConfig<T, N, UniSocket<T>, UniControl<T>>) {
    super(label)

    this.width = width
    this.height = height
    this.dataOperation = dataOperation
    this.executeOperation = executeOperation
    
    this.inputKeys = Object.keys(inputs)
    for (const key in inputs) {
      const inputParam = inputs[key]
      const input = new ClassicPreset.Input(socket, inputParam.label)
      if (inputParam.control) input.addControl(new ClassicPreset.InputControl<'number'|'text'>(inputParam.control.type, { initial: inputParam.control.initial, change: inputParam.control.change, readonly: inputParam.control.readonly }))
      this.addInput(key, input)
    }

    this.outputKeys = Object.keys(outputs)
    for (const key in outputs) {
      const outputParam = outputs[key]
      if (outputParam.control) this.addControl(key, new ClassicPreset.InputControl<'number'|'text'>(outputParam.control.type, { initial: outputParam.control.initial, readonly: outputParam.control.readonly, change: outputParam.control.change }))
      this.addOutput(key, new ClassicPreset.Output(socket, outputParam.label))
    }
    
    this.controlKeys = Object.keys(controls)
    for (const key in controls) {
      const control = controls[key]
      this.addControl(key, new ClassicPreset.InputControl<'number'|'text'>(control.type, { initial: control.initial, readonly: control.readonly, change: control.change }))
    }
  }
  data(inputs: Record<string, Array<N>>):{ [key:string]: N } {
    if (this.dataOperation) {
      const returnValue = this.dataOperation(inputs, this)
      // @ts-ignore 2683
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
// @ts-ignore 2683
declare interface createUniNodeFactor {
  updateOutputControls?:(controlIds:Array<string>) => void
}

export function getCreateUniNode<T extends 'text'|'number', N extends string | number>(factor:createUniNodeFactor) {
  // if (node.executeOperation) {
  //   node.execute = (function(input:string, forward: (output:string) => void):void {
  //     // @ts-ignore 2683
  //     this.executeOperation(forward, this)
  //   }).bind(node)
  // }
  return function createUniNode(config:UniNodeConfig<T, N, UniSocket<T>, UniControl<T>>):UniNode<T, N> {
    const node = new UniNode(config)
    if (factor.updateOutputControls) node.updateOutputControls = factor.updateOutputControls
    return node
  }
}