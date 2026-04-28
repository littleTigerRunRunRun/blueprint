import { ClassicPreset } from 'rete'
import type { GraphNode, GraphEditor } from '../define'
import { ReteEditor } from './rete'
import { createEditorExcutor } from './excutor'

export class Node extends ClassicPreset.Node {
  public type = 'node'
  public name: string
  public parent?: string
  constructor(config: GraphNode) {
    super(config.label)

    this.id = config.id
    this.name = config.name
    if (config.parent) this.parent = config.parent
  }
}

// 可注入的依赖项
class Sizable {

}

export class Group {

}

export class Line {

}

export class Socket {

}

export class Editor {
  public container:HTMLDivElement|null = null
  public editor:any // GraphEditor|null = null
  protected nodeProto:typeof Node = Node
  protected lineProto:typeof Line = Line
  protected groupProto:typeof Group = Group
  protected socketProto:typeof Socket = Socket
  protected geViews = {
    
  } // ge = graph element
  constructor() {
  }

  // 设置node的原型
  public setNodeProto(proto: typeof Node) {
    this.nodeProto = proto
  }

  // 设置line的原型
  public setLineProto(proto: typeof Line) {
    this.lineProto = proto
  }

  // 设置group的原型
  public setGroupProto(proto: typeof Group) {
    this.groupProto = proto
  }

  public setSocketProto(proto: typeof Socket) {
    this.socketProto = proto
  }

  public init(container:HTMLDivElement) {
    this.container = container

    const { excutor, destroy } = createEditorExcutor(new ReteEditor({ container }))
  }

  public destroy() {

  }
}