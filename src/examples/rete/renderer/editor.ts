import { NodeEditor, ClassicPreset } from 'rete'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'

import { type Schemes, type AreaExtra, Node, Connection, ButtonControl, ProgressControl } from './define'
import CustomButton from './myButton.vue'
import CustomProgress from './myProgress.vue'

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const render = new VuePlugin<Schemes, AreaExtra>()
  render.addPreset(Presets.classic.setup({
    customize: {
      control(data) {
        if (data.payload instanceof ButtonControl) {
          return CustomButton;
        }
        if (data.payload instanceof ProgressControl) {
          return CustomProgress;
        }
        if (data.payload instanceof ClassicPreset.InputControl) {
          return Presets.classic.Control;
        }
      }
    }
  }))

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  connection.addPreset(ConnectionPresets.classic.setup())

  const socket = new ClassicPreset.Socket('socket')
  
  editor.use(area)
  area.use(render)
  area.use(connection)
  
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    // accumulating: { active() { return false} }
    accumulating: AreaExtensions.accumulateOnCtrl()
  })
  AreaExtensions.simpleNodesOrder(area)

  const progressControl = new ProgressControl(24);
  const inputControl = new ClassicPreset.InputControl("number", {
    initial: 24,
    change(value) {
      progressControl.percent = value;
      area.update("control", progressControl.id);
    }
  })
  
  const nodeA = new Node('A')
  nodeA.addControl("input", inputControl)
  nodeA.addControl("progress", progressControl)
  nodeA.addControl(
    "button",
    new ButtonControl("Randomize", () => {
      const percent = Math.round(Math.random() * 100)

      inputControl.setValue(percent)
      area.update("control", inputControl.id)

      progressControl.percent = percent
      area.update("control", progressControl.id)
    })
  )
  await editor.addNode(nodeA);

  AreaExtensions.zoomAt(area, editor.getNodes())
}