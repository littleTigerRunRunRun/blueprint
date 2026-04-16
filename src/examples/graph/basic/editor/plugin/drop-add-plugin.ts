import { type Root, Scope, NodeEditor } from 'rete'
import { type Area2DInherited, type Area2D, AreaPlugin } from 'rete-area-plugin'
import type { Point, Schemes } from '../define'

// declare interface DropAddHandlers {
//   onPointerEnter: (position:{ x:number, y:number }) => void
//   onPointerMove: () => void
//   onPointerLeave: () => void
// }

type getDropCenter = (width: number, height: number) => { x: number; y: number }

type DraggingTemplate = { nodes: Array<Schemes['Node'] & { position: Point }>, lines: Array<Schemes['Connection']> }

// 该插件用于协助外部的拖拽添加捕捉鼠标挪入、鼠标挪出、鼠标拖拽元素移动等功能，以及借由retejs的scope系统，监听node新增和减少并抛出事件
export class DropAddPlugin extends Scope<never, Area2DInherited<Schemes, never>> {
  draggingNode: Schemes['Node'] | null = null
  draggingTemplate: DraggingTemplate | null = null
  dragging = false
  area: AreaPlugin<Schemes> | null = null
  editor: NodeEditor<Schemes> | null = null
  // private handlers?:DropAddHandlers
  constructor(
    private getDropCenter: getDropCenter = (width, height) => ({ x: 0.5 * width, y: 0.5 * height }),
    private handler?: {
      onNodeAdd?: (data: Schemes['Node']) => void
      onNodeRemove?: (data: Schemes['Node']) => void
    }
  ) {
    super('DropAdd')
  }

  setParent(scope: Scope<Area2D<Schemes>, [Root<Schemes>]>): void {
    super.setParent(scope)

    // 获取到该组件的父级元素area
    this.area = this.parentScope<AreaPlugin<Schemes>>(AreaPlugin)
    this.editor = this.area.parentScope<NodeEditor<Schemes>>(NodeEditor)

    // 为画布容器元素绑定移入、移出时间
    this.area.container.addEventListener('pointerenter', this.onPointerEnter)
    this.area.container.addEventListener('pointermove', this.onPointerMove)
    this.area.container.addEventListener('pointerleave', this.onPointerLeave)

    this.addPipe((context) => {
      if (context.type === 'nodecreated') {
        if (this.handler?.onNodeAdd) this.handler?.onNodeAdd(context.data)
      }
      if (context.type === 'noderemoved') {
        if (this.handler?.onNodeRemove) this.handler?.onNodeRemove(context.data)
      }
      return context
    })
  }

  onPointerEnter = async (event: PointerEvent) => {
    if (this.area) {
      if (this.draggingNode) {
        this.dragging = true
  
        this.area.area.setPointerFrom(event)
        // this.handlers?.onPointerEnter(area.area.pointer)
  
        await this.editor?.addNode(this.draggingNode)
        if (this.select) this.select(this.draggingNode.id, false)
        const view = this.area.nodeViews.get(this.draggingNode.id)
        if (view) {
          const dropCenter = this.getDropCenter(this.draggingNode.width, this.draggingNode.height)
          view.translate(
            this.area.area.pointer.x - dropCenter.x,
            this.area.area.pointer.y - dropCenter.y
          )
        }
      }
  
      if (this.draggingTemplate) {
        await this.unselectAll?.()
        this.dragging = true
        this.area.area.setPointerFrom(event)
  
        for (const node of this.draggingTemplate.nodes) {
          await this.editor?.addNode(node)
          if (this.select) this.select(node.id, true)
          const view = this.area.nodeViews.get(node.id)
          if (view) {
            view.translate(
              this.area.area.pointer.x + node.position.x,
              this.area.area.pointer.y + node.position.y
            )
          }
        }

        for (const line of this.draggingTemplate.lines) {
          await this.editor?.addConnection(line)
        }
      }
    }
  }

  onPointerMove = (event: PointerEvent) => {
    if (this.dragging && this.area) {
      if (this.draggingNode) {
        this.area.area.setPointerFrom(event)
        const view = this.area.nodeViews.get(this.draggingNode.id)
        if (view) {
          const dropCenter = this.getDropCenter(this.draggingNode.width, this.draggingNode.height)
          view.translate(
            this.area.area.pointer.x - dropCenter.x,
            this.area.area.pointer.y - dropCenter.y
          )
        }
      }
  
      if (this.draggingTemplate) {
        this.area.area.setPointerFrom(event)
  
        for (const node of this.draggingTemplate.nodes) {
          const view = this.area.nodeViews.get(node.id)
          if (view) {
            view.translate(
              this.area.area.pointer.x + node.position.x,
              this.area.area.pointer.y + node.position.y
            )
          }
        }
      }
    }
  }

  onPointerLeave = async () => {
    this.dragging = false
    if (this.draggingNode) await this.editor?.removeNode(this.draggingNode.id)
    if (this.draggingTemplate) {
      for (const node of this.draggingTemplate.nodes) {
        this.editor?.removeNode(node.id)
      }
      for (const line of this.draggingTemplate.lines) {
        this.editor?.removeConnection(line.id)
      }
    }
  }

  add = (creator: () => Schemes['Node']) => {
    this.draggingNode = creator()
  }

  addTemplate = (template: DraggingTemplate) => {
    this.draggingTemplate = template
  }

  remove = () => {
    // 结算逻辑
    this.draggingNode = null
    this.draggingTemplate = null
    this.dragging = false
  }
 
  select?: (nodeId: string, accumulate: boolean) => void
  unselect?: (nodeId: string) => void
  unselectAll?: () => Promise<void>
  getSelectHanlder(selectHanlder: {
    select: (nodeId: string, accumulate: boolean) => void
    unselect: (nodeId: string) => void
    unselectAll: () => Promise<void>
  }) {
    this.select = selectHanlder.select
    this.unselect = selectHanlder.unselect
    this.unselectAll = selectHanlder.unselectAll
  }

  destroy() {
    this.area?.container.removeEventListener('pointerenter', this.onPointerEnter)
    this.area?.container.removeEventListener('pointerleave', this.onPointerLeave)
    this.area = null
    this.editor = null
  }
}
