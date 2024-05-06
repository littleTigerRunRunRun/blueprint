import { NodeEditor, ClassicPreset } from "rete"
import { AreaPlugin, AreaExtensions } from "rete-area-plugin"
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin"
import { ReactPlugin, Presets } from "rete-react-plugin"
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable.d'
import { getDOMSocketPosition } from 'rete-render-utils'
import { ScopesPlugin, Presets as ScopesPresets } from '@/lib/rete-extend/rete-scopes-plugin'
import type { Size } from "rete-scopes-plugin/_types/types"
// import { ScopesPlugin, Presets as ScopesPresets } from 'rete-scopes-plugin'
// import { structures } from 'rete-structures'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
// import { structures } from 'rete-structures'
import { createRoot } from 'react-dom/client'

import type { Schemes, AreaExtra, StarMapAbilityDefine, StarmapGraph, StarmapAllNode, StarmapAllConnection } from './define'
import { StarMapAbility } from './define'
import { NodeView, GroupView, ConnectionView, SocketView } from './view'
import { getCreateUniNode, scopeElder } from '@/lib/uniNode'

const groupMiniSize = { width: 190, height: 150 }
const createUniNode = getCreateUniNode<'text'|'number', string|number>({})
const createSizeNode = () => {
  return createUniNode({
    label: '自定义节点',
    type: 'common',
    width: 150,
    height: 177,
    inputs: {
      hide: { label: '隐藏' },
      show: { label: '显示' }
    },
    outputs: {
      onVisibleSwitch: { label: '切换显隐' }
    },
    controls: {}
  })
}
const createGroup = () => {
  return createUniNode({
    label: '分组',
    type: 'group',
    hasChildren: true,
    width: groupMiniSize.width,
    height: groupMiniSize.height,
    inputs: {},
    outputs: {},
    controls: {}
  })
}

export async function createEditor(container: HTMLElement, abilities:StarMapAbilityDefine) {
  const socket = new ClassicPreset.Socket("socket")

  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot })
  const scopes = new ScopesPlugin<Schemes>({
    elder: scopeElder,
    size: (_id:string, size:Size) => {
      return {
        width: Math.max(size.width, groupMiniSize.width),
        height: Math.max(size.height, groupMiniSize.height)
      }
    }
  })
  const arrange = new AutoArrangePlugin<Schemes>()

  class MySelector<E extends SelectorEntity> extends AreaExtensions.Selector<E> {
    add(entity:E, accumulate:boolean):void {
      super.add(entity, accumulate)
      // console.log('added', entity)
    }
  
    remove(entity: E):void {
      super.remove(entity)
      // console.log('removed', entity)
    }
  }
  
  arrange.addPreset(ArrangePresets.classic.setup())
  render.addPreset(
    Presets.classic.setup({
      socketPositionWatcher: getDOMSocketPosition({
        offset: (position, _nodeId, side, _key) => {
          return {
            x: position.x + (side === 'output' ? 5 : -5),
            y: position.y
          }
        }
      }),
      customize: {
        node(context) {
          switch (context.payload.type) {
            case 'common': return NodeView
            case 'group': return GroupView
          }
          return NodeView
        },
        socket(_context) {
          return SocketView
        },
        connection(_context) {
          return ConnectionView
        }
      }
    })
  )
  scopes.addPreset(ScopesPresets.classic.setup())
  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(render)
  area.use(scopes)
  area.use(arrange)

  // 能力注册：
  abilities.forEach(([name, config]) => {
    switch (name) {
      case StarMapAbility.NODE_SELECTABLE: {
        AreaExtensions.selectableNodes(area, new MySelector(), {
          accumulating: AreaExtensions.accumulateOnCtrl()
        })
        break
      }
      case StarMapAbility.HOT_KEY: {
        console.log('hotkey config', config)
        break
      }
    }
  })

  const a = createSizeNode()
  await editor.addNode(a)

  const b = createSizeNode()
  await editor.addNode(b)

  const group = createGroup()
  await editor.addNode(group)

  await area.translate(b.id, { x: 320, y: 0 })

  await editor.addConnection(new ClassicPreset.Connection(a, "onVisibleSwitch", b, "hide"))

  await arrange.layout()
  AreaExtensions.zoomAt(area, editor.getNodes())

  return {
    destroy: () => area.destroy(),
    import: (data:StarmapGraph<StarmapAllNode, StarmapAllConnection>) => {
      console.log('data', data)
    },
    export: () => {
      return {} as StarmapGraph<StarmapAllNode, StarmapAllConnection>
    }
  }
}