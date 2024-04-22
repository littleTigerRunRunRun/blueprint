import { NodeEditor } from 'rete'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { ControlFlowEngine, DataflowEngine } from 'rete-engine'
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'

import { type Schemes, type AreaExtra, UniNode, getCreateUniNode, Connection } from './define'

export async function createEditor(
  container: HTMLElement,
  log: (text: string) => void
) {
  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const engine = new ControlFlowEngine<Schemes>(() => {
    return {
      inputs: () => ["exec"],
      outputs: () => ["exec"]
    }
  })
  const dataflow = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () => Object.keys(inputs).filter((name) => name !== "exec"),
      outputs: () => Object.keys(outputs).filter((name) => name !== "exec")
    }
  })
  
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
        exec: { label: '执行' },
        message: { label: '信息', control: { type: 'text', initial: message } }
      },
      outputs: {
        exec: { label: '执行' }
      },
      controls: {
      },
      executeOperation: async (forward, self):Promise<void> => {
        const inputs = (await dataflow.fetchInputs(self.id)) as {
          message: string[]
        }
    
        log((inputs.message && inputs.message[0]) || '')

        forward("exec")
      }
    })
  }

  // 毫秒
  const createText = (text:string) => {
    return createUniNode({
      label: '文本',
      width: 180,
      height: 120,
      inputs: {},
      outputs: {
        value: { label: '执行', control: { type: 'text', initial: text } }
      },
      controls: {},
      dataOperation: (inputs, self):{ value: string } => {
        return {
          value: (self.controls.value.value as string) || ''
        }
      }
    })
  }

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Start", () => createStart()],
      ["Log", () => createLog('')],
      ["Text", () => createText('你好')]
    ])
  })
  
  const arrange = new AutoArrangePlugin<Schemes>()
  arrange.addPreset(ArrangePresets.classic.setup())
  
  editor.use(area)
  editor.use(engine)
  editor.use(dataflow)
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
  const text1 = createText('日志')
  const log1 = createLog()

  const con1 = new Connection(start, "exec", log1, "exec")
  const con2 = new Connection(text1, "value", log1, "message")

  await editor.addNode(start)
  await editor.addNode(text1)
  await editor.addNode(log1)

  await editor.addConnection(con1)
  await editor.addConnection(con2)

  const interval = setInterval(() => {
    dataflow.reset()
    engine.execute(start.id)
  }, 1000)

  await arrange.layout()
  AreaExtensions.zoomAt(area, editor.getNodes())

  return {
    destroy: () => {
      clearInterval(interval)
      area.destroy()
    }
  }
}