import { NodeEditor, ClassicPreset } from 'rete'
import { VuePlugin, Presets } from 'rete-vue-plugin'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { type SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { DataflowEngine } from 'rete-engine'
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'

import { type Schemes, type AreaExtra, SMONode, defineSMONode, NumberNode, Connection } from './define'

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const engine = new DataflowEngine<Schemes>()
  
  const render = new VuePlugin<Schemes, AreaExtra>()
  render.addPreset(Presets.classic.setup())
  render.addPreset(Presets.contextMenu.setup())

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  connection.addPreset(ConnectionPresets.classic.setup())
  
  const arrange = new AutoArrangePlugin<Schemes>()
  arrange.addPreset(ArrangePresets.classic.setup())

  const process = () => {
    engine.reset()

    editor
      .getNodes()
      .filter((n) => n instanceof SMONode)
      .forEach((n) => {
        engine.fetch(n.id)
      })
  }

  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add(entity:E, accumulate:boolean):void {
      super.add(entity, accumulate)
      console.log('added', entity)
    }
  
    remove(entity: E):void {
      super.remove(entity)
      console.log('removed', entity)
    }
  }

  const createAdd = () => {
    return defineSMONode({
      type: 'add',
      label: '加法',
      initSize: { width: 180, height: 200 },
      change: process,
      update: (c) => { for (const control of c) { area.update("control", control.id) }},
      inputs: {
        param1: { label: '参数一', initial: 0 },
        param2: { label: '参数二', initial: 0 }
      },
      outputs: {
        result: { label: '结果' }
      },
      operation: (inputs, self) => {
        const control1 = self.inputs.param1?.control as ClassicPreset.InputControl<'number'>
        const control2 = self.inputs.param2?.control as ClassicPreset.InputControl<'number'>
  
        const { param1, param2 } = inputs
        const result = (param1 ? param1[0] : control1.value || 0) + (param2 ? param2[0] : control2.value || 0)
        self.controls.result.setValue(result)
        return { result }
      }
    })
  }

  const createSubtract = () => {
    return defineSMONode({
      type: 'subtract',
      label: '减法',
      initSize: { width: 180, height: 200 },
      change: process,
      update: (c) => { for (const control of c) { area.update("control", control.id) }},
      inputs: {
        param1: { label: '参数一', initial: 0 },
        param2: { label: '参数二', initial: 0 }
      },
      outputs: {
        result: { label: '结果' }
      },
      operation: (inputs, self) => {
        const control1 = self.inputs.param1?.control as ClassicPreset.InputControl<'number'>
        const control2 = self.inputs.param2?.control as ClassicPreset.InputControl<'number'>
  
        const { param1, param2 } = inputs
        const result = (param1 ? param1[0] : control1.value || 0) - (param2 ? param2[0] : control2.value || 0)
        self.controls.result.setValue(result)
        return { result }
      }
    })
  }

  const createMultiply = () => {
    return defineSMONode({
      type: 'multiply',
      label: '乘法',
      initSize: { width: 180, height: 200 },
      change: process,
      update: (c) => { for (const control of c) { area.update("control", control.id) }},
      inputs: {
        param1: { label: '参数一', initial: 0 },
        param2: { label: '参数二', initial: 0 }
      },
      outputs: {
        result: { label: '结果' }
      },
      operation: (inputs, self) => {
        const control1 = self.inputs.param1?.control as ClassicPreset.InputControl<'number'>
        const control2 = self.inputs.param2?.control as ClassicPreset.InputControl<'number'>
  
        const { param1, param2 } = inputs
        const result = (param1 ? param1[0] : control1.value || 0) * (param2 ? param2[0] : control2.value || 0)
        self.controls.result.setValue(result)
        return { result }
      }
    })
  }

  const createDivide= () => {
    return defineSMONode({
      type: 'subtract',
      label: '除法',
      initSize: { width: 180, height: 200 },
      change: process,
      update: (c) => { for (const control of c) { area.update("control", control.id) }},
      inputs: {
        param1: { label: '参数一', initial: 0 },
        param2: { label: '参数二', initial: 0 }
      },
      outputs: {
        result: { label: '结果' }
      },
      operation: (inputs, self) => {
        const control1 = self.inputs.param1?.control as ClassicPreset.InputControl<'number'>
        const control2 = self.inputs.param2?.control as ClassicPreset.InputControl<'number'>
  
        const { param1, param2 } = inputs
        const result = (param1 ? param1[0] : control1.value || 0) / (param2 ? param2[0] : control2.value || 0)
        self.controls.result.setValue(result)
        return { result }
      }
    })
  }

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["数字", () => new NumberNode(1, process)],
      ["加法", () => createAdd()],
      ["减法", () => createSubtract()],
      ["乘法", () => createMultiply()],
      ["除法", () => createDivide()]
    ])
  })
  
  editor.use(area)
  editor.use(engine)
  area.use(render)
  area.use(connection)
  area.use(contextMenu)
  area.use(arrange)
  
  // AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
  AreaExtensions.selectableNodes(area, new MySelector(), {
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
  const c = createAdd()

  const con1 = new Connection(a, "value", c, "param1")
  const con2 = new Connection(b, "value", c, "param2")

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