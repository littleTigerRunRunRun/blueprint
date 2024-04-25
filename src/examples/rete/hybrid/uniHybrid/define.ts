import { type GetSchemes, ClassicPreset } from 'rete'
import { type VueArea2D } from 'rete-vue-plugin'
import { type ContextMenuExtra } from "rete-context-menu-plugin"
import { UniNode } from '../../lib/uniNode/0.0.1'

export { UniNode, getCreateUniNode } from '../../lib/uniNode/0.0.1'

const socket = new ClassicPreset.Socket('socket')

export type Node = UniNode<'text'|'number', string|number>

export class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> {
  isLoop?: boolean
}

export type Schemes = GetSchemes<
  Node,
  Connection<Node, Node>
>
export type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra
