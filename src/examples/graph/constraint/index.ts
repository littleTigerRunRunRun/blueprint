import { Editor, Node } from '../lib'
import type { DFDGraphNode, GraphNodeParamObject } from './define'

export class DFDNode extends Node {
  protected content: GraphNodeParamObject
  constructor(config: DFDGraphNode) {
    super(config)

    this.content = config.content
  }
}

export const editor = new Editor()

editor.setNodeProto(DFDNode)