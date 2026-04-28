import { Scope, NodeEditor, type Root, type BaseSchemes } from 'rete'
import { type Area2DInherited, type Area2D, AreaPlugin } from 'rete-area-plugin'
import { areaToScreen, screenToArea } from '../smoothZoom'

export type NodeScaleRotateEvent =
  | { type: 'nsscalestart'; data: { id: string; direction: ScaleDirection; event: PointerEvent } }
  | { type: 'nsrotatestart'; data: { id: string; event: PointerEvent } }

export type ScaleDirection = 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br'

export type NodeScaleRotateContext = Area2D<BaseSchemes> | Root<BaseSchemes> | NodeScaleRotateEvent

function calculateAngle(width:number, height:number) {
  if (width <= 0 || height < 0) {
      throw new Error("宽度必须为正数，高度不能为负数");
  }
  
  // 使用 Math.atan2 计算弧度，y为height, x为width
  const radians = Math.atan2(height, width);
  
  // 将弧度转换为角度
  const degrees = radians * (180 / Math.PI);
  
  return degrees;
}

export class NodeScaleRotatePlugin<S> extends Scope<NodeScaleRotateEvent, Area2DInherited<BaseSchemes, NodeScaleRotateEvent>> {
  area: AreaPlugin<BaseSchemes> | null = null
  editor: NodeEditor<BaseSchemes> | null = null

  private floatingPanel: HTMLDivElement | null = null
  private scaleHandles: Map<ScaleDirection, HTMLDivElement> = new Map()
  private rotateHandle: HTMLDivElement | null = null

  private activeNodeId: string = ''
  private startPosition = { x: 0, y: 0 }
  private lastPosition = { x: 0, y: 0 }
  private startNodeBounds = { x: 0, y: 0, width: 0, height: 0, rotation: 0 }
  private startPointerAngle: number = 0

  private isScaling: boolean = false
  private isRotating: boolean = false
  private rotation: number = 0
  private currentDirection: ScaleDirection | null = null

  constructor() {
    super('NodeScaleRotate')
    this.createFloatingPanel()
  }

  setParent(scope: Scope<Area2D<BaseSchemes>, [Root<BaseSchemes>]>): void {
    super.setParent(scope)

    this.area = this.parentScope<AreaPlugin<BaseSchemes>>(AreaPlugin)
    this.editor = this.area.parentScope<NodeEditor<BaseSchemes>>(NodeEditor)

    this.area.addPipe((context) => {
      if (context.type === 'nodepicked') {
        const selectedNodes = this.editor?.getNodes().filter(n => n.selected) || []
        if (selectedNodes.length === 1 && selectedNodes[0].id === context.data.id) {
          if (this.editor?.getNode(context.data.id)?.name === 'noderr') {
            this.activeNodeId = context.data.id
            this.showFloatingPanel(context.data.id)
          }
        } else {
          this.hideFloatingPanel()
          this.activeNodeId = ''
        }
      }
      if (context.type === 'nodedragged' || context.type === 'nodetranslated') {
        if (this.activeNodeId) {
          this.updateFloatingPanelPosition(this.activeNodeId)
        }
      }
      return context
    })

    this.addPipe((context) => {
      if (context.type === 'nsscalestart') {
        this.startScale(context.data.id, context.data.direction, context.data.event)
      } else if (context.type === 'nsrotatestart') {
        this.startRotate(context.data.id, context.data.event)
      } else if (context.type === 'pointermove') {
        if (this.isScaling) {
          this.handleScale(context.data.event)
        } else if (this.isRotating) {
          this.handleRotate(context.data.event)
        }
      } else if (context.type === 'pointerdown' || context.type === 'noderemoved') {
        if ((this.editor?.getNodes().filter(n => n.selected) || []).length === 0 && this.activeNodeId) {
          this.hideFloatingPanel()
          this.activeNodeId = '' 
        }
      } else if (context.type === 'pointerup') {
        this.endScaleRotate()
      } else if (context.type === 'zoomed' && this.activeNodeId) {
        this.updateFloatingPanelPosition(this.activeNodeId)
      }
      return context
    })
  }

  private createFloatingPanel(): void {
    this.floatingPanel = document.createElement('div')
    this.floatingPanel.className = 'node-scale-rotate-panel'

    const directions: ScaleDirection[] = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br']
    directions.forEach(dir => {
      const handle = document.createElement('div')
      handle.className = `scale-handle scale-handle-${dir}`
      handle.dataset.direction = dir
      this.scaleHandles.set(dir, handle)
      this.floatingPanel!.appendChild(handle)
    })

    this.rotateHandle = document.createElement('div')
    this.rotateHandle.className = 'rotate-handle'
    const rotateIcon = document.createElement('span')
    rotateIcon.className = 'rotate-icon'
    this.rotateHandle.appendChild(rotateIcon)
    this.floatingPanel.appendChild(this.rotateHandle)

    this.bindHandleEvents()
  }

  private bindHandleEvents(): void {
    this.scaleHandles.forEach((handle, direction) => {
      handle.addEventListener('pointerdown', (e: PointerEvent) => {
        e.stopPropagation()
        if (this.activeNodeId) {
          this.emit({
            type: 'nsscalestart',
            data: { id: this.activeNodeId, direction, event: e }
          })
        }
      })
    })

    this.rotateHandle?.addEventListener('pointerdown', (e: PointerEvent) => {
      e.stopPropagation()
      if (this.activeNodeId) {
        this.emit({
          type: 'nsrotatestart',
          data: { id: this.activeNodeId, event: e }
        })
      }
    })
  }

  private showFloatingPanel(nodeId: string): void {
    if (!this.floatingPanel || !this.area) return
    const node = this.editor?.getNode(nodeId)
    if (node) {
      // @ts-ignore
      if (node.rotation !== undefined) {
        // @ts-ignore
        this.rotation = node.rotation
      } else this.rotation = 0
    }

    this.area.container.appendChild(this.floatingPanel)
    this.updateFloatingPanelPosition(nodeId)
  }

  private hideFloatingPanel(): void {
    if (this.floatingPanel?.parentNode) {
      this.floatingPanel.parentNode.removeChild(this.floatingPanel)
    }
  }

  // 
  private updateFloatingPanelPosition(nodeId: string): void {
    if (!this.floatingPanel || !this.area || !this.editor) return

    const node = this.editor.getNode(nodeId)
    const nodeView = this.area.nodeViews.get(nodeId)
    if (!node || !nodeView) return

    const { x, y } = nodeView.position
    const transform = this.area.area.transform

    const pointLT = areaToScreen(x, y, transform)
    const pointRB = areaToScreen(x + node.width, y + node.height, transform)
    const w1 = Math.abs(pointLT.x - pointRB.x)
    const h1 = Math.abs(pointLT.y - pointRB.y)

    // 如果存在旋转的话，需要计算旋转之后的大框
    const diagonal = Math.hypot(w1, h1)
    const angle1 = calculateAngle(w1, h1) - this.rotation
    const angle2 = -calculateAngle(w1, h1) - this.rotation
    const sinr1 = Math.sin(angle1 * Math.PI / 180)
    const cosr1 = Math.cos(angle1 * Math.PI / 180)
    const sinr2 = Math.sin(angle2 * Math.PI / 180)
    const cosr2 = Math.cos(angle2 * Math.PI / 180)

    const panelWidth = Math.max(Math.abs(cosr1), Math.abs(cosr2)) * diagonal
    const panelHeight = Math.max(Math.abs(sinr1), Math.abs(sinr2)) * diagonal
    const panelX = (pointRB.x + pointLT.x) * 0.5 - panelWidth * 0.5
    const panelY = (pointRB.y + pointLT.y) * 0.5 - panelHeight * 0.5
    const handleSize = 12

    this.floatingPanel.style.width = `${panelWidth}px`
    this.floatingPanel.style.height = `${panelHeight}px`
    this.floatingPanel.style.left = `${panelX}px`
    this.floatingPanel.style.top = `${panelY}px`
    this.floatingPanel.style.display = 'block'

    this.scaleHandles.forEach((handle, direction) => {
      let left = '50%'
      let top = '50%'
      let transform = 'translate(-50%, -50%)'

      switch (direction) {
        case 't':
          top = '0px'
          handle.style.cursor = 'n-resize'
          break
        case 'b':
          top = '100%'
          handle.style.cursor = 's-resize'
          break
        case 'l':
          left = '0px'
          handle.style.cursor = 'w-resize'
          break
        case 'r':
          left = '100%'
          handle.style.cursor = 'e-resize'
          break
        case 'tl':
          left = '0px'
          top = '0px'
          handle.style.cursor = 'nw-resize'
          break
        case 'tr':
          left = '100%'
          top = '0px'
          handle.style.cursor = 'ne-resize' 
          break
        case 'bl':
          left = '0px'
          top = '100%'
          handle.style.cursor = 'sw-resize'
          break
        case 'br':
          left = '100%'
          top = '100%'
          handle.style.cursor = 'se-resize'
          break
      }

      handle.style.left = left
      handle.style.top = top
      handle.style.transform = transform
      handle.style.width = `${handleSize}px`
      handle.style.height = `${handleSize}px`
    })

    if (this.rotateHandle) {
      this.rotateHandle.style.left = '50%'
      this.rotateHandle.style.top = '-30px'
      this.rotateHandle.style.transform = 'translate(-50%, -50%)'
    }
  }

  private startScale(nodeId: string, direction: ScaleDirection, event: PointerEvent): void {
    if (!this.editor || !this.area) return

    const node = this.editor.getNode(nodeId)
    const nodeView = this.area.nodeViews.get(nodeId)
    if (!node || !nodeView) return

    this.isScaling = true
    this.currentDirection = direction
    this.startPosition = { x: event.pageX, y: event.pageY }
    this.lastPosition = { x: event.pageX, y: event.pageY }
    this.startNodeBounds = {
      x: nodeView.position.x,
      y: nodeView.position.y,
      width: node.width,
      height: node.height,
      rotation: (node as any).rotation || 0
    }
  }

  // 
  private async handleScale(event: PointerEvent): Promise<void> {
    if (!this.isScaling || !this.currentDirection || !this.editor || !this.area) return

    const node = this.editor.getNode(this.activeNodeId)
    if (!node) return

    const delta = {
      x: (event.pageX - this.lastPosition.x) / this.area.area.transform.k,
      y: (event.pageY - this.lastPosition.y) / this.area.area.transform.k
    }
    this.lastPosition = { x: event.pageX, y: event.pageY }

    const dir = this.currentDirection

    const nodeView = this.area.nodeViews.get(this.activeNodeId)
    if (!nodeView) {
      throw new Error('Node view not found')
    }
    const size = this.editor.getNode(this.activeNodeId)
    if (!size) {
      throw new Error('Node size not found')
    }
    const nodePosition = Object.assign({}, nodeView.position)
    if (dir.includes('l')) {
      size.width -= delta.x
      size.width = Math.max(size.width, 1)
      nodePosition.x += delta.x
    }
    if (dir.includes('r')) {
      size.width += delta.x
      size.width = Math.max(size.width, 1)
    }
    if (dir.includes('t')) {
      size.height -= delta.y
      size.height = Math.max(size.height, 1)
      nodePosition.y += delta.y
    }
    if (dir.includes('b')) {
      size.height += delta.y
      size.height = Math.max(size.height, 1)
    }

    await this.area.update('node', this.activeNodeId)
    await this.area.translate(this.activeNodeId, nodePosition)
    this.updateFloatingPanelPosition(this.activeNodeId)
  }

  private startRotate(nodeId: string, event: PointerEvent): void {
    if (!this.editor || !this.area) return

    const node = this.editor.getNode(nodeId)
    const nodeView = this.area.nodeViews.get(nodeId)
    if (!node || !nodeView) return

    this.isRotating = true
    this.startPosition = { x: event.pageX, y: event.pageY }

    const { x, y } = nodeView.position
    const centerX = x + node.width / 2
    const centerY = y + node.height / 2

    this.startPointerAngle = Math.atan2(event.pageY - centerY, event.pageX - centerX)
    this.startNodeBounds.rotation = (node as any).rotation || 0
  }

  private handleRotate(event: PointerEvent): void {
    if (!this.isRotating || !this.editor || !this.area) return

    const node = this.editor.getNode(this.activeNodeId)
    const nodeView = this.area.nodeViews.get(this.activeNodeId)
    if (!node || !nodeView) return

    const { x, y } = nodeView.position
    const centerX = x + node.width / 2
    const centerY = y + node.height / 2

    const currentAngle = Math.atan2(event.pageY - centerY, event.pageX - centerX)
    const deltaAngle = (currentAngle - this.startPointerAngle) * (180 / Math.PI)

    const newRotation = this.startNodeBounds.rotation + deltaAngle
    ;(node as any).rotation = newRotation
    this.rotation = newRotation

    this.area.update('node', this.activeNodeId)
    this.updateFloatingPanelPosition(this.activeNodeId)
  }

  private endScaleRotate(): void {
    this.isScaling = false
    this.isRotating = false
    this.currentDirection = null
  }

  destroy(): void {
    this.hideFloatingPanel()
    this.scaleHandles.clear()
    this.rotateHandle = null
    this.area = null
    this.editor = null
  }
}