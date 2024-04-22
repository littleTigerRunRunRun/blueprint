import { type GetSchemes, ClassicPreset } from 'rete'
import { type VueArea2D } from 'rete-vue-plugin'
import { type ContextMenuExtra } from "rete-context-menu-plugin"
import { SMONode } from './SMONode'

export { SMONode, defineSMONode } from './SMONode'

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

export type Node = NumberNode | SMONode

export class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> {}

export type Schemes = GetSchemes<
  Node,
  Connection<NumberNode, SMONode> | Connection<SMONode, SMONode>
>
export type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra