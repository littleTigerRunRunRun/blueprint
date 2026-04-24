import { type Root, Scope, NodeEditor } from 'rete'
import { type Area2DInherited, type Area2D, AreaPlugin } from 'rete-area-plugin'
import type { Schemes, Point, Rect, side } from '../define'
import { getRectCenter } from '../tool/path'
import { subscriber } from '../tool/Subscriber'
import { screenToArea } from '../tool/smoothZoom'
import { throttle } from 'lodash'

function isRectangleContained(largeRect:Rect, smallRect:Rect) {
  // 判断小矩形是否被大矩形包含
  return (
      largeRect.x <= smallRect.x &&
      largeRect.x + largeRect.width >= smallRect.x + smallRect.width &&
      largeRect.y <= smallRect.y &&
      largeRect.y + largeRect.height >= smallRect.y + smallRect.height
  );
}

// 框选插件，可以设置状态开启或者用辅助间控制状态开启
export class RectSelectPlugin extends Scope<never, Area2DInherited<Schemes, never>> {
  area: AreaPlugin<Schemes> | null = null
  editor: NodeEditor<Schemes> | null = null
  selectingRectDom: HTMLDivElement
  
  constructor() {
    super('RectSelect')

    this.selectingRectDom = document.createElement('div')
    this.selectingRectDom.style.display = 'none'
    this.selectingRectDom.style.position = 'fixed'
    this.selectingRectDom.style.zIndex = '10000'
    this.selectingRectDom.style.border = '1px solid #1890ff'
  }
  
  setParent(scope: Scope<Area2D<Schemes>, [Root<Schemes>]>): void {
    super.setParent(scope)

    // 获取到该组件的父级元素area
    this.area = this.parentScope<AreaPlugin<Schemes>>(AreaPlugin)
    this.editor = this.area.parentScope<NodeEditor<Schemes>>(NodeEditor)

    this.area.container.appendChild(this.selectingRectDom)

    this.addPipe((context) => {
      if (context.type === 'rectselect') {
        const start = context.data.start
        const end = context.data.end
        if (start && end) {
          // 正在框选
          this.updateSelectingRect(start, end)
        } else {
          // 结束框选
          this.selectingRectDom.style.display = 'none'
        }
      }
      return context
    })
  }

  private updateSelectingRect(start:Point, end:Point) {
    const { left, top } = this.area!.container.getBoundingClientRect()

    const rectLeft = Math.min(start.x, end.x) - left
    const rectTop = Math.min(start.y, end.y) - top
    const width = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)
    
    this.selectingRectDom.style.display = 'block'
    this.selectingRectDom.style.left = `${rectLeft}px`
    this.selectingRectDom.style.top = `${rectTop}px`
    this.selectingRectDom.style.width = `${width}px`
    this.selectingRectDom.style.height = `${height}px`

    const areaStart = screenToArea(start.x, start.y, this.area!.area.transform)
    const areaEnd = screenToArea(end.x, end.y, this.area!.area.transform)

    this.checkRectSelect({
      x: Math.min(areaStart.x, areaEnd.x),
      y: Math.min(areaStart.y, areaEnd.y),
      width: Math.abs(areaStart.x - areaEnd.x),
      height: Math.abs(areaStart.y - areaEnd.y)
    })
  }

  private checkRectSelect = throttle((selectRect:Rect) => {
    const { selector, selectableNodes } = subscriber.get('connectionSelector')

    const rectSelecting:Array<string> = []
    const rectSelectingLines:Array<string> = []

    this.editor?.getNodes().forEach((node) => {
      // 目前写死了只有node类型参与框选判断，实际上需要外面传入判断条件、是否包含的判断条件（比如节点中心被包含就算，还是必须所有内容框入才算）
      if (node.name !== 'node') return
      const position = this.area!.nodeViews.get(node.id)!.position
      const rect = {
        ...position,
        width: node.width,
        height: node.height
      }
      // console.log(selectRect, node.id, rect, isRectangleContained(selectRect, rect))

      if (isRectangleContained(selectRect, rect)) rectSelecting.push(node.id)
    })
    this.editor?.getConnections().forEach((line) => {
      const source = this.editor?.getNode(line.source)
      const sourcePos = this.area?.nodeViews.get(line.source)?.position
      const target = this.editor?.getNode(line.target)
      const targetPos = this.area?.nodeViews.get(line.target)?.position
      const startPos = getRectCenter({
        x: sourcePos!.x,
        y: sourcePos!.y,
        width: source!.width,
        height: source!.height
      }, line.sourceOutput as side)
      const endPos = getRectCenter({
        x: targetPos!.x,
        y: targetPos!.y,
        width: target!.width,
        height: target!.height
      }, line.targetInput as side)

      const rect = {
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(startPos.x - endPos.x),
        height: Math.abs(startPos.y - endPos.y)
      }
      if (isRectangleContained(selectRect, rect)) {
        rectSelectingLines.push(line.id)
      }
    })

    selector.entities.forEach((entity:any) => {
      // 框选的包含了已选中的，从rectSelecting中去掉该id
      if (rectSelecting.includes(entity.id)) rectSelecting.splice(rectSelecting.indexOf(entity.id), 1)
      // 已选中的在rectSelecting中不存在，说明该节点已经被取消选中了
      else {
        selectableNodes.unselect(entity.id)
      }
    })

    // rectSelectingLines.forEach((id) => {
    //   subscriber.broadcast('HANDLE_SELECT_LINE', id)
    // })

    // rectSelecting中存在，而selector。entities中不存在，说明要新增选中
    rectSelecting.forEach((id) => {
      selectableNodes.select(id, true)
    })
  }, 20)

  // 激活框选状态（会覆盖画布本身的拖动功能）
  public activate() {

  }

  // 退出框选状态
  public inactivate() {

  }

  destroy() {
    this.area?.container.removeChild(this.selectingRectDom);
    (this.selectingRectDom as any) = null

    this.area = null
    this.editor = null
  }
}