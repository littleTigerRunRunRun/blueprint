import { NodeEditor } from 'rete'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { ControlFlowEngine } from 'rete-engine'
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'

import { type Schemes, type AreaExtra, Start, Log, Delay, Connection } from './define'

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

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Start", () => new Start()],
      ["Log", () => new Log("", log)],
      ["Delay", () => new Delay(1)]
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

  const start = new Start()
  const log1 = new Log("log before delay", log)
  const delay = new Delay(5)
  const log2 = new Log("log after delay", log)

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