import { Scope, Root, NodeEditor } from 'rete'
import { Area2DInherited, Area2D, AreaPlugin } from 'rete-area-plugin'
import { Schemes as StarmapSchemes } from './define'

// declare interface DropAddHandlers {
//   onPointerEnter: (position:{ x:number, y:number }) => void
//   onPointerMove: () => void
//   onPointerLeave: () => void
// }

type getDropCenter = (width: number, height: number) => { x: number, y: number }

// 该插件用于协助外部的拖拽添加捕捉鼠标挪入、鼠标挪出、鼠标拖拽元素移动等功能。
export class DropAddPlugin<Schemes extends StarmapSchemes> extends Scope<never, Area2DInherited<Schemes, never>>  {
  draggingNode:Schemes['Node']|null = null
  dragging = false
  area:AreaPlugin<Schemes>|null = null
  editor:NodeEditor<Schemes>|null = null
  // private handlers?:DropAddHandlers
  constructor(
    private getDropCenter:getDropCenter = (width, height) => ({ x: 0.5 * width, y: 0.5 * height })
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
  }

  onPointerEnter = async (event:PointerEvent) => {
    if (this.draggingNode && this.area) {
      this.dragging = true

      this.area.area.setPointerFrom(event)
      // this.handlers?.onPointerEnter(area.area.pointer)

      this.editor?.addNode(this.draggingNode)
      const view = this.area.nodeViews.get(this.draggingNode.id)
      if (view) {
        const dropCenter = this.getDropCenter(this.draggingNode.width, this.draggingNode.height)
        view.translate(this.area.area.pointer.x - dropCenter.x, this.area.area.pointer.y - dropCenter.y)
      }
    }
  }

  onPointerMove = (event:PointerEvent) => {
    if (this.dragging && this.draggingNode && this.area) {
      this.area.area.setPointerFrom(event)
      const view = this.area.nodeViews.get(this.draggingNode.id)
      if (view) {
        const dropCenter = this.getDropCenter(this.draggingNode.width, this.draggingNode.height)
        view.translate(this.area.area.pointer.x - dropCenter.x, this.area.area.pointer.y - dropCenter.y)
      }
    }
  }

  onPointerLeave = () => {
    this.dragging = false
    if (this.draggingNode) this.editor?.removeNode(this.draggingNode.id)
  }

  add = (creator: () => Schemes['Node']) => {
    this.draggingNode = creator()
  }

  remove = () => {
    // 结算逻辑
    this.draggingNode = null
    this.dragging = false
  }

  destroy() {
    this.area?.container.removeEventListener('pointerenter', this.onPointerEnter)
    this.area?.container.removeEventListener('pointerleave', this.onPointerLeave)
    this.area = null
    this.editor = null
  }
}