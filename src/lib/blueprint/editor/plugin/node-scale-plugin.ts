import { Scope, Root, NodeEditor } from 'rete'
import { Area2DInherited, Area2D, AreaPlugin } from 'rete-area-plugin'
import { Schemes as StarmapSchemes } from '../define'

export type extraEvent = {
  type: 'nsstart',
  data: {
    id: string,
    event: React.PointerEvent,
    constraint: {
      min?: { width: number, height: number },
      max?: { width: number, height: number }
    }
  }
}
export type NodeScaleContext = Area2D<StarmapSchemes> | Root<StarmapSchemes> | extraEvent

export class NodeScalablePlugin<Schemes extends StarmapSchemes> extends Scope<extraEvent, Area2DInherited<Schemes, extraEvent>>  {
  area:AreaPlugin<Schemes>|null = null
  editor:NodeEditor<Schemes>|null = null
  nsid:string = ''
  nsStartPosition = { x: 0, y: 0 }
  nsConstraint: {
    min?: { width: number, height: number },
    max?: { width: number, height: number }
  } = {}
  constructor() {
    super('NodeScalable')
  }
 
  setParent(scope: Scope<Area2D<Schemes>, [Root<Schemes>]>): void {
    super.setParent(scope)

    // 获取到该组件的父级元素area
    this.area = this.parentScope<AreaPlugin<Schemes>>(AreaPlugin)
    this.editor = this.area.parentScope<NodeEditor<Schemes>>(NodeEditor)

    // 为画布容器元素绑定移入、移出时间

    this.addPipe(context => {
      if (context.type === 'nsstart') {
        this.nsid = context.data.id
        this.nsStartPosition.x = context.data.event.pageX
        this.nsStartPosition.y = context.data.event.pageY
        this.nsConstraint = context.data.constraint || {}

        // console.log(this.editor?.getNode(this.nsid), this.area?.nodeViews.get(this.nsid))
      } else if (context.type === 'pointermove') {
        if (this.nsid) {
          const delta = { x: context.data.event.pageX - this.nsStartPosition.x, y: context.data.event.pageY - this.nsStartPosition.y }
          this.nsStartPosition.x = context.data.event.pageX
          this.nsStartPosition.y = context.data.event.pageY

          const node = this.editor?.getNode(this.nsid)
          if (node) {
            let width = node.width + delta.x / (this.area?.area.transform.k || 1)
            let height = node.height + delta.y / (this.area?.area.transform.k || 1)
            if (this.nsConstraint.min) {
              width = Math.max(this.nsConstraint.min.width, width)
              height = Math.max(this.nsConstraint.min.height, height)
            }
            if (this.nsConstraint.max) {
              width = Math.min(this.nsConstraint.max.width, width)
              height = Math.min(this.nsConstraint.max.height, height)
            }
            node.width = width
            node.height = height
            this.area?.resize(this.nsid, node.width, node.height)
          }
        }
      } else if (context.type === 'pointerup') {
        if (this.nsid) {
          this.nsid = ''
          // console.log('end')
        }
      }
      return context
    })
  }

  destroy() {
    this.area = null
    this.editor = null
  }
} 