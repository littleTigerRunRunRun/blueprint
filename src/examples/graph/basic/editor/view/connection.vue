<template>
  <svg class="graph-connection" :class="{ selected: data?.selected }">
    <path :d="tpath" class="interval-path" @click="handleSelect" />
    <path
      :d="tpath"
      :marker-end="line.arrow.value ? 'url(#graph_connection_arrow)' : ''"
      :stroke="data?.selected ? '#1890ff' : '#999'"
      stroke-width="1.8"
      class="view-path"
      :class="{
        dotted: !line.solid.value,
        flow: line.flow.value
      }"
    />
    <!-- <text fill="#000" font-size="12">{{ data.id }}</text> -->
  </svg>
</template>

<script lang="ts" setup>
import { subscriber } from '../tool/Subscriber';
import { GraphLineType, type GraphLineParamsObject, type GraphLineParams, type side } from '../define'
import { watch, ref, onBeforeUnmount, onMounted } from 'vue';
import { generateOrthogonalPath, getRectCenter, createRadiusOrthPath, createCurve } from '../tool/path'
const { data, path } = defineProps(['path', 'data'])
const emit = defineEmits(['update:data'])

let globalLine:GraphLineParamsObject = {
  type: GraphLineType.MANHATTAN,
  solid: true,
  flow: false,
  arrow: false
}

let tpath = ref('')
const line = {
  type: ref(GraphLineType.MANHATTAN),
  arrow: ref(false),
  solid: ref(true),
  flow: ref(false)
}

watch(() => path, () => {
  if (!path) return
  tpath.value = createPath()
})

function createPath() {
  // 连线逻辑还需要优化，仍然存在重复渲染的情况
  const { editor, area } = subscriber.get('connectionSelector')
  const sn = editor.getNode(data.source)
  const snv = area.nodeViews.get(data.source)?.position
  if (!snv) return ''
  const srect = {
    x: snv!.x,
    y: snv!.y,
    width: sn!.width,
    height: sn!.height
  }
  const sside = data.sourceOutput
  const trect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  if (path) {
    const point1 = path.split(',').map((str:string) => parseFloat(str))
    trect.x = point1[0]
    trect.y = point1[1]
  }
  let tside:side = 'l'
  if (subscriber.get('hoveringSocket') || data.target) {
    const tn = editor.getNode(data.target || subscriber.get('hoveringSocket')!.nodeId)
    const tnv = area.nodeViews.get(data.target || subscriber.get('hoveringSocket')!.nodeId)
    trect.x = tnv!.position.x
    trect.y = tnv!.position.y
    trect.width = tn!.width
    trect.height = tn!.height
    tside = (data.targetInput || subscriber.get('hoveringSocket')!.key) as side
  }
  const start = getRectCenter(srect, sside, data.sourceAnchor)
  const end = getRectCenter(trect, tside, data.targetAnchor)

  switch (data.line.type) {
    case GraphLineType.MANHATTAN: {
      let paddingEnd = 0
      if (subscriber.get('hoveringSocket') || data.target) {
        paddingEnd = 15
      }

      // to do: 该方法没有考虑sourceAnchor和targetAnchor的情况
      const points = generateOrthogonalPath(
        srect, data.sourceOutput, 15,
        trect, tside, paddingEnd,
        start, end
      )
      for (let i = 0; i < points.length - 1; i++) {
        const point = points[i]
        const next = points[i + 1]
        if (point.x === next.x && point.y === next.y) {
          points.splice(i, 1)
          i--
        }
      }
      
      const path = createRadiusOrthPath(points, 0)

      return path
    }
    case GraphLineType.STRAIGHT: {
      return `M${start!.x},${start!.y}, L${end!.x},${end!.y}`
    }
    case GraphLineType.CURVE: {
      const points = [start, end]
      return createCurve(points, 10)
    }
    default: {
      return ''
    }
  }
}

const onLineChanged = (id:string, params:GraphLineParams) => {
  if (id !== data.id) return
  const gcs = subscriber.get('connectionSelector')
  const nData = Object.assign({}, data)
  nData.line[params.attr] = params.param
  emit('update:data', nData)

  line[params.attr].value = params.param
  if (params.attr === 'type') tpath.value = createPath()
}
subscriber.listen('CHANGE_LINE', onLineChanged)

const handleSelect = () => {
  const gcs = subscriber.get('connectionSelector')
  gcs.selector.add(
    {
      id: data.id,
      label: 'connection',
      translate() {},
      unselect: () => {
        data.selected = false
        emit('update:data', data)
        gcs.area.update("connection", data.id);
        subscriber.broadcast('SELECT_LINE', globalLine)
      }
    },
    gcs.accumulating.active()
  );
  data.selected = true
  emit('update:data', data)
  gcs.area.update("connection", data.id);
  globalLine = Object.assign({}, subscriber.get('line'))
  subscriber.broadcast('SELECT_LINE', data.line)
}

onMounted(() => {
  tpath.value = createPath()
  line.type.value = data?.line?.type
  line.arrow.value = data?.line?.arrow
  line.solid.value = data?.line?.solid
  line.flow.value = data?.line?.flow
})

onBeforeUnmount(() => {
  subscriber.remove('CHANGE_LINE', onLineChanged)
})
</script>

<style lang="scss">
.graph-connection {
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;
  z-index: 4;
  &.selected {
    z-index: 5;
    // .view-path {
    //   stroke: #1890ff;
    // }
  }
  .view-path {
    fill: none;
    // stroke: #666;
    pointer-events: none;
    &.dotted {
      stroke-dasharray: 6 6;
    }
    &.flow {
      stroke-dasharray: 6 6;
      animation: GraphFlowLine 3s infinite linear;
    }
  }
  .interval-path {
    fill: none;
    stroke-width: 6px;
    stroke: #000;
    stroke-opacity: 0;
    pointer-events: auto;
    cursor: pointer;
  }
}

@keyframes GraphFlowLine {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -60;
  }
}
</style>
