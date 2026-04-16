<template>
  <!-- 包裹在各种定制node外的通用功能容器，比如点击后 -->
  <div
    class="graph-node-interval-container"
    :class="{
      selected: data?.selected
    }"
    :style="{
      width: `${data?.width}px`,
      height: `${data?.height}px`
    }"
  >
    <NodeEnd v-if="data?.name === 'end'" :data="data" :selected="data?.selected" />
    <NodeStart v-else-if="data?.name === 'start'" :data="data" :selected="data?.selected" />
    <Node v-else :data="data" :selected="data?.selected" />

    <!-- <div
      v-for="(input, key) in data.inputs"
      :key="`input_${key}`"
      class="socket input"
      :class="[key]"
    >
      <Ref
        class="input-socket"
        :emit="emit"
        :data="{ type: 'socket', side: 'input', key, nodeId: data.id, payload: input.socket }"
        data-testid="input-socket"
      />
    </div> -->

    <div
      v-for="(output, key) in data.outputs"
      :key="`output_${key}`"
      class="socket output"
      :class="[key]"
    >
      <Ref
        class="output-socket"
        :emit="emit"
        :data="{ type: 'socket', side: 'output', key, nodeId: data.id, payload: output.socket }"
        data-testid="output-socket"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { UniNode } from '../tool/uniNode'
import Node from './node.vue'
import NodeStart from './node-start.vue'
import NodeEnd from './node-end.vue';
import { Ref } from 'rete-vue-plugin'

const { data, emit } = defineProps(['data', 'emit'])

// console.log(data)
</script>

<style lang="scss">
.graph-node-interval-container {
  position: absolute;
  z-index: 1;
  .socket {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #666;
    background-color: #fff;
    position: absolute;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
    z-index: 2;
    &.l,&.r{
      top: 50%;
    }
    &.t,&.b {
      left: 50%;
    }
    &.l { left: 0%; }
    &.r { left: 100%; }
    &.t { top: 0%; }
    &.b { top: 100%;}

    &>div{
      position: absolute;
      left: -2px;
      top: -2px;
      width: 12px; /* 实际可触摸范围可以大于这个，到时候把瞬间触发范围做大一点 */
      height: 12px;
      cursor: pointer;
      border-radius: 50%;
      background: #36C38E;
      opacity: 0;
      box-sizing: border-box;
    }
  }
  &.selected, &:hover {
    .socket {
      opacity: 1;
    }
  }
  &.selected {
    cursor: move;
  }
}
</style>
