import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

// 简单数学运算：输入1-N个输入数值，得到一个输出数值的过程
// SMO = Simple Math Operation
export type SMOType = 'add' | 'subtract' | 'multiply' | 'divide'
export interface SMOParam {
  label: string
  // static?: boolean
  initial?: number
}
export interface SMOConfig {
  type: SMOType
  label: string
  initSize: { width: number, height: number }
  change?:(value:number) => void
  update?:(controls: Array<ClassicPreset.InputControl<'number'>>) => void
  inputs:Record<string, SMOParam>
  outputs:Record<string, SMOParam>
  operation:(inputs: Record<string, Array<number>>, self:SMONode) => { [key:string]: number }
}

export class SMONode extends ClassicPreset.Node<
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.InputControl<'number'>>
>{
  type: SMOType
  width: number
  height: number
  update?:(controls: Array<ClassicPreset.InputControl<'number'>>) => void
  operation:(inputs: Record<string, Array<number>>, self:SMONode) => { [key:string]: number }
  inputKeys:Array<string>
  outputKeys:Array<string>
  constructor({ type, label, initSize, change, update, inputs, outputs, operation }:SMOConfig) {
    super(label)
    this.type = type
    this.width = initSize.width
    this.height = initSize.height
    this.update = update
    this.operation = operation
    
    this.inputKeys = Object.keys(inputs)
    for (const key in inputs) {
      const inputParam = inputs[key]
      const input = new ClassicPreset.Input(socket, inputParam.label)
      input.addControl(new ClassicPreset.InputControl('number', { initial: inputParam.initial || 0, change }))
      // if (!param.static) {
      // }
      this.addInput(key, input)
    }

    this.outputKeys = Object.keys(outputs)
    for (const key in outputs) {
      const outputParam = outputs[key]
      this.addControl(key, new ClassicPreset.InputControl('number', { readonly: true, initial: outputParam.initial || 0 }))
      this.addOutput(key, new ClassicPreset.Output(socket, outputParam.label))
    }
  }
  data(inputs: Record<string, Array<number>>): { [key:string]: number } {
    const returnValue = this.operation(inputs, this)
    if (this.update) this.update(this.outputKeys.map((key) => this.controls[key]))

    return returnValue
  }
}

export function defineSMONode(config:SMOConfig) {
  return new SMONode(config)
}