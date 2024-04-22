import { GetSchemes, ClassicPreset } from 'rete'
import { VueArea2D } from 'rete-vue-plugin'
import { ContextMenuExtra } from "rete-context-menu-plugin"

const socket = new ClassicPreset.Socket('socket')

export class NumberNode extends ClassicPreset.Node<
  {},
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.InputControl<'number'>>
> {
  width = 180
  height = 130
  constructor(initial:number, change?:(value:number) => void) {
    super('整数')

    this.addControl('value', new ClassicPreset.InputControl('number', { initial, change }))
    this.addOutput('value', new ClassicPreset.Output(socket, '参数'))
  }
  data(): { value: number } {
    return {
      value: this.controls.value.value || 0
    }
  }
}

// Add Subtract Multiply Divide
export class AddNode extends ClassicPreset.Node<
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.InputControl<'number'>>
> {
  width = 180
  height = 200
  constructor(
    change?:(value:number) => void,
    private update?:(control: ClassicPreset.InputControl<'number'>) => void    
  ) {
    super('加法')

    const left = new ClassicPreset.Input(socket, '参数1')
    const right = new ClassicPreset.Input(socket, '参数2')

    left.addControl(new ClassicPreset.InputControl('number', { initial: 0, change }))
    right.addControl(new ClassicPreset.InputControl('number', { initial: 0, change }))

    this.addInput('left', left)
    this.addInput('right', right)

    this.addControl('value', new ClassicPreset.InputControl('number', { readonly: true }))
    this.addOutput('value', new ClassicPreset.Output(socket, '结果'))
  }
  data(inputs: { left?: number[], right?: number[] }): { value: number } {
    const leftControl = this.inputs.left?.control as ClassicPreset.InputControl<'number'>
    const rightControl = this.inputs.right?.control as ClassicPreset.InputControl<'number'>

    const { left, right } = inputs
    const value = (left ? left[0] : leftControl.value || 0) +
                  (right ? right[0] : rightControl.value || 0)
    this.controls.value.setValue(value)

    if (this.update) this.update(this.controls.value)

    return { value }
  }
}

export type Node = NumberNode | AddNode

export class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> {}

export type Schemes = GetSchemes<
  Node,
  Connection<NumberNode, AddNode> | Connection<AddNode, AddNode>
>
export type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra