<template>
  <div
    class="graph-group"
    :class="{
      selected: data?.selected
    }"
    :style="{
      width: `${data!.width + 2}px`,
      height: `${data!.height + 2}px`
    }"
  >
    <div
      class="group-switch"
      :class="{ expand: expand }"
      @click="switchGroupExpand"
      @pointerdown.stop
    />
    <template v-if="expand">
      <span
        class="group-header"
      >
        <span
          contenteditable="true"
          @input="handleChange"
        >{{ data?.label }}</span>
      </span>
      <div className="resize-corner" @pointerdown.stop="onPointerDown" />
    </template>
    <template v-else>
      <div class="status-vis">
        <div :style="{ width: `${status * 100}%` }" />
      </div>
      <span
        class="shrink-group"
        :style="{
          lineHeight: `${data!.height}px`
        }"
        contenteditable="true"
        @input="handleChange"
      >{{ data?.label }}</span>
      
      <div
        v-for="(output, key) in data?.outputs"
        :key="`output_${key}`"
        class="socket output"
        :class="[key]"
      >
        <Ref
          class="output-socket"
          :emit="emit"
          :data="{ type: 'socket', side: 'output', key, nodeId: data?.id, payload: output?.socket }"
          data-testid="output-socket"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUpdated } from 'vue'
import { UniNode, createNode } from '../tool/uniNode'
import { subscriber } from '../tool/Subscriber';
import type { DataFlowGroupShrinkInfo, DataFlowLine, Point } from '../define';
import { Connection } from '../define';
import { getUID } from 'rete';

const { data, emit } = defineProps({
  data: UniNode,
  emit: Function
})

const expand = ref(data?.expand)
const status = ref(0)
const statusArr:Array<string> = []

onUpdated(() => {
  if (!expand.value && data?.shrinkInfo) {
    // @ts-ignore
    if (data.status !== undefined && !statusArr.includes(data.status)) {
      // @ts-ignore
      statusArr.push(data.status)
      status.value = statusArr.length / data.shrinkInfo.nodes.length
    }
    
  }
})

const switchGroupExpand = async () => {
  if (!data) throw new Error('no data')
  data.expand = !data.expand
  expand.value = !expand.value

  const { editor, area } = subscriber.get('connectionSelector')
  const thisPosition:Point = area.nodeViews.get(data.id).position
  if (expand.value && data.shrinkInfo) {
    // 内容展开
    // 1. 遍历当前画布和group相连的连线，将其全部删除
    const lines = editor.getConnections().forEach(async (line:DataFlowLine) => {
      if (line.source === data.id || line.target === data.id) {
        await editor.removeConnection(line.id);
      }
    })
    // 2. 恢复group的原始位置和尺寸
    const nx = thisPosition.x + 50 - data.shrinkInfo.width * 0.5
    const ny = thisPosition.y + 20 - data.shrinkInfo.height * 0.5
    data.width = data.shrinkInfo.width
    data.height = data.shrinkInfo.height
    await area.translate(data.id, { x: nx, y: ny });
    await area.update("node", data.id)
    // 3. 添加group内的子节点
    for (const nd of data.shrinkInfo.nodes) {
      const node = createNode({
        id: nd.id,
        name: nd.name,
        label: nd.label,
        width: nd.width,
        height: nd.height,
        parent: data.id
      })
      await editor.addNode(node)
      // 将容器中的相对位置恢复成画布的绝对位置
      const position = {
        x: nx + data.width * nd.position.x - nd.width * 0.5,
        y: ny + data.height * nd.position.y - nd.height * 0.5
      }
      await area.translate(nd.id, position);
    }
    // 4. 添加node的关联连线
    for (const ld of data.shrinkInfo.lines) {
      const connection = new Connection(
        ld.id,
        editor.getNode(ld.source) as UniNode,
        ld.sourceOutput,
        editor.getNode(ld.target) as UniNode,
        ld.targetInput,
      );
      connection.line = ld.line
      await editor.addConnection(connection);
    }
    // 5. 清空shrinkInfo记录
    delete data.shrinkInfo
  } else {
    // 内容收起
    // 1. 遍历获得group的子节点，然后遍历获得子节点的相关连线, 包括group原始尺寸，共同记录成shrinkInfo
    const children:Array<UniNode> = editor.getNodes().filter((node:UniNode) => node.parent === data.id)
    const childIds = children.map((child) => child.id)
    const childInnerPlaces:Record<string, { x: number, y: number }> = {}
    children.forEach((node) => {
      const nPosition = area.nodeViews.get(node.id).position
      childInnerPlaces[node.id] = {
        x: (nPosition.x - thisPosition.x + node.width * 0.5) / data.width,
        y: (nPosition.y - thisPosition.y + node.height * 0.5) / data.height
      }
    })
    const virtualLines:Array<DataFlowLine> = []
    const lines:Array<DataFlowLine> = editor.getConnections().filter((line:DataFlowLine) => {
      const related = childIds.includes(line.source) || childIds.includes(line.target)
      if (related) {
        const isInner = childIds.includes(line.source) && childIds.includes(line.target)
        if (!isInner) {
          if (childIds.includes(line.source)) {
            // 连线是从内部发向外界的
            virtualLines.push({
              id: getUID(),
              source: data.id,
              sourceOutput: line.sourceOutput,
              sourceAnchor: childInnerPlaces[line.source],
              target: line.target,
              targetInput: line.targetInput,
              line: line.line
            })
          } else {
            virtualLines.push({
              id: getUID(),
              source: line.source,
              sourceOutput: line.sourceOutput,
              target: data.id,
              targetInput: line.targetInput,
              targetAnchor: childInnerPlaces[line.target],
              line: line.line
            })
          }
        }
      }

      return related
    })
    const shrinkInfo:DataFlowGroupShrinkInfo = {
      width: data.width,
      height: data.height,
      nodes: children.map((child) => ({
        id: child.id,
        label: child.label,
        name: child.name,
        width: child.width,
        height: child.height,
        // 记录的node position是node中心位置在group容器中的位置
        position: childInnerPlaces[child.id]
      })),
      lines
    }
    data.shrinkInfo = shrinkInfo

    // 2. 删除这些相关节点、连线
    for (const line of lines) {
      await editor.removeConnection(line.id);
    }
    for (const cid of childIds) {
      await editor.removeNode(cid)
    }
    
    // 3. 收缩group尺寸为node级尺寸，取消可缩放能力，并且为其添加不可交互的虚拟socket
    const nx = thisPosition.x + data.width * 0.5 - 50
    const ny = thisPosition.y + data.height * 0.5 -20
    data.width = 100
    data.height = 40
    await area.translate(data.id, { x: nx, y: ny });
    await area.update("node", data.id);

    // 4. 根据之前group内连线锚点的位置，生成虚拟连线来模拟之前的连接效果，进行连接
    for (const vl of virtualLines) {
      const connection = new Connection(
          vl.id,
          editor.getNode(vl.source) as UniNode,
          vl.sourceOutput,
          editor.getNode(vl.target) as UniNode,
          vl.targetInput,
        );
        // connection.flowType = ld.flowType;
        // connection.dataType = ld.dataType;
        connection.line = vl.line
        connection.sourceAnchor = vl.sourceAnchor
        connection.targetAnchor = vl.targetAnchor
        await editor.addConnection(connection);
    }
  }
}

const onPointerDown=(event: PointerEvent) => {
  if (emit && data) {
    emit({
      type: "nsstart",
      data: {
        id: data.id,
        constraint: {},
        event,
      },
    })
  }
}

const handleChange = (val:InputEvent) => {
  // @ts-ignore
  const text = val?.target?.innerText
  if (data) data.label = text
}
</script>

<style lang="scss">
.graph-group {
  position: absolute;
  left: -1px;
  top: -1px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 4px;
  text-align: center;
  color: #333;
  font-size: 14px;
  user-select: none;
  box-sizing: border-box;
  &.selected {
    border-color: #1890ff;
  }
  .group-switch {
    position: absolute;
    top: 10px;
    right: -5px;
    width: 20px;
    height: 20px;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    transform: translate(-50%, -50%);
    &:before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      transform: translate(-50%, -50%);
    }
    &.expand:before {
      border-top: 5px solid #333;
    }
    &:not(.expand) {
      top: 19px;
      right: 0px;
      &:before {
        border-bottom: 5px solid #333;
      }
    }
  }
  .group-header{
    display: block;
    text-align: left;
    text-indent: 4px;
    width: 100%;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    border-bottom: 1px solid #333;
    span:focus-visible {
      border: none;
      outline: none;
      padding: 0;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .resize-corner{
    position: absolute;
    width: 20px;
    height: 20px;
    right: 0;
    bottom: 0;
    cursor: nwse-resize;
    &:before {
      content: '';
      position: absolute;
      display: block;
      right: 1px;
      bottom: 1px;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #666;
      border-bottom-right-radius: 4px;
    }
    &:hover::before{
      border-bottom-color: #999;
    }
  }
  .shrink-group:focus-visible {
    position: relative;
    border: none;
    outline: none;
    padding: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 2;
  }
  .socket{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0px;
    height: 0px;
  }
  .status-vis{
    position: absolute;
    width:100%;
    height:100%;
    overflow:hidden;
    position: absolute;
    left: 0%;
    top:0%;
    z-index: 0;
    div {
      width: 0%;
      height: 100%;
      background-color: #11b949;
      opacity: 0.5;
      transition: width 0.8s;
    }
  }
}
</style>
