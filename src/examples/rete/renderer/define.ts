import { type GetSchemes, ClassicPreset } from 'rete'
import { type VueArea2D } from 'rete-vue-plugin'

export class ButtonControl extends ClassicPreset.Control {
  constructor(public label: string, public onClick: () => void) {
    super();
  }
}

export class ProgressControl extends ClassicPreset.Control {
  constructor(public percent: number) {
    super();
  }
}

export class Node extends ClassicPreset.Node<
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.Socket>,
  Record<string, ButtonControl | ProgressControl | ClassicPreset.InputControl<'number'> | ClassicPreset.InputControl<'text'>>
>{}

export class Connection<A extends Node> extends ClassicPreset.Connection<A, A> {}

export type Schemes = GetSchemes<
  Node,
  Connection<Node>
>
export type AreaExtra = VueArea2D<Schemes>