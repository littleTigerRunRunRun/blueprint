import { NodeEditor } from 'rete'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { ControlFlowEngine } from 'rete-engine'
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'

import { type Schemes, type AreaExtra, getCreateUniNode, Connection } from './define'

export async function createEditor(
  container: HTMLElement,
  log: (text: string) => void
) {
  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const engine = new ControlFlowEngine<Schemes>()
  
  const render = new VuePlugin<Schemes, AreaExtra>()
  render.addPreset(Presets.classic.setup())
  render.addPreset(Presets.contextMenu.setup())

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  connection.addPreset(ConnectionPresets.classic.setup())

  const createUniNode = getCreateUniNode<'text'|'number', string|number>({})

  const createStart = () => {
    return createUniNode({
      label: '开始',
      width: 180,
      height: 90,
      inputs: {},
      outputs: {
        exec: { label: '执行' }
      },
      controls: {},
      executeOperation: (forward, self):void => {
        forward('exec')
      }
    })
  }

  const createLog = (message?:string) => {
    return createUniNode({
      label: '日志',
      width: 180,
      height: 160,
      inputs: {
        exec: { label: '执行' }
      },
      outputs: {
        exec: { label: '执行' }
      },
      controls: {
        message: { type: 'text', initial: message }
      },
      executeOperation: (forward, self):void => {
        log(self.controls.message.value as string)

        forward("exec")
      }
    })
  }

  // 毫秒
  const createDelay = (time:number) => {
    return createUniNode({
      label: '延时',
      width: 180,
      height: 160,
      inputs: {
        exec: { label: '执行' }
      },
      outputs: {
        exec: { label: '执行' }
      },
      controls: {
        delaytime: { type: 'number', initial: time }
      },
      executeOperation: (forward, self):void => {
        const delaytime = self.controls.delaytime.value as number
        setTimeout(
          () => {
            forward("exec")
          },
          delaytime ? delaytime : 1000
        )
      }
    })
  }

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Start", () => createStart()],
      ["Log", () => createLog('')],
      ["Delay", () => createDelay(1000)]
    ])
  })
  
  const arrange = new AutoArrangePlugin<Schemes>()
  arrange.addPreset(ArrangePresets.classic.setup())
  
  editor.use(area)
  editor.use(engine)
  area.use(render)
  area.use(connection)
  area.use(contextMenu)
  area.use(arrange)
  
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    // accumulating: { active() { return false} }
    accumulating: AreaExtensions.accumulateOnCtrl()
  })
  AreaExtensions.simpleNodesOrder(area)
  AreaExtensions.showInputControl(area)

  const start = createStart()
  const log1 = createLog('log before delay')
  const delay = createDelay(5000)
  const log2 = createLog('log after delay')

  const con1 = new Connection(start, "exec", log1, "exec")
  const con2 = new Connection(log1, "exec", delay, "exec")
  const con3 = new Connection(delay, "exec", log2, "exec")
  const con4 = new Connection(log2, "exec", log1, "exec")

  con4.isLoop = true

  await editor.addNode(start)
  await editor.addNode(log1)
  await editor.addNode(delay)
  await editor.addNode(log2)

  await editor.addConnection(con1)
  await editor.addConnection(con2)
  await editor.addConnection(con3)
  await editor.addConnection(con4)

  engine.execute(start.id)

  await arrange.layout()
  AreaExtensions.zoomAt(area, editor.getNodes())

  return {
    destroy: () => area.destroy()
  }
}