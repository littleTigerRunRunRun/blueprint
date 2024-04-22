import { NodeEditor } from 'rete'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { DataflowEngine } from 'rete-engine'
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'

import { Schemes, AreaExtra, AddNode, NumberNode, Connection } from './define'

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const engine = new DataflowEngine<Schemes>()
  
  const render = new VuePlugin<Schemes, AreaExtra>()
  render.addPreset(Presets.classic.setup())
  render.addPreset(Presets.contextMenu.setup())

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  connection.addPreset(ConnectionPresets.classic.setup())

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Number", () => new NumberNode(1, process)],
      ["Add", () => new AddNode(process, (c) => area.update("control", c.id))]
    ])
  })
  
  const arrange = new AutoArrangePlugin<Schemes>()
  arrange.addPreset(ArrangePresets.classic.setup())

  const process = () => {
    engine.reset()

    editor
      .getNodes()
      .filter((n) => n instanceof AddNode)
      .forEach((n) => {
        console.log(n)
        engine.fetch(n.id)
      })
  }
  
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

  editor.addPipe((context) => {
    if (["connectioncreated", "connectionremoved"].includes(context.type)) {
      process()
    }
    return context
  })
  
  const a = new NumberNode(1, process)
  const b = new NumberNode(1, process)
  const c = new AddNode(process, (c) => area.update("control", c.id))

  const con1 = new Connection(a, "value", c, "left")
  const con2 = new Connection(b, "value", c, "right")

  await editor.addNode(a)
  await editor.addNode(b)
  await editor.addNode(c)

  await editor.addConnection(con1)
  await editor.addConnection(con2)

  await arrange.layout()
  AreaExtensions.zoomAt(area, editor.getNodes())

  return {
    destroy: () => area.destroy()
  }
}