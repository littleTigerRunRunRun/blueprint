<template>
  <div
    class="customized-node"
    :class="{ selected: data.selected }"
    :style="{
      width: `${data.width}px`,
      height: `${data.height}px`
    }"
    data-testid="node"
  >
    <div class="border" />
    <div class="customized-title">{{ data.label }}</div>
    <div class="customized-content">
      <div class="content-block align-right">
        <div class="content-block-title">事件</div>
        <div class="content--socket-line"
          v-for="(v, k) in data.outputs"
          :key="`${k + seed}`"
        >
          {{ v.label }}
          <div class="socket-container">
            <Ref
              class="output-socket"
              :emit="emit"
              :data="{ type: 'socket', side: 'output', key: k, nodeId: data.id, payload: v.socket }"
              data-testid="output-socket"
            />
          </div>
        </div>
      </div>
      <!-- <Ref class="control" v-for="[key, control] in controls()" :key="key + seed" :emit="emit"
      :data="{ type: 'control', payload: control }" :data-testid="'control-' + key" /> -->
      <div class="content-block align-left no-next">
        <div class="content-block-title">动作</div>
        <div class="content--socket-line"
          v-for="(v, k) in data.inputs"
          :key="`${k + seed}`"
        >
          {{ v.label }}
          <div class="socket-container">
            <Ref
              class="input-socket"
              :emit="emit"
              :data="{ type: 'socket', side: 'input', key: k, nodeId: data.id, payload: v.socket }"
              data-testid="input-socket"
            />
          </div>
          <Ref
            class="input-control"
            v-show="v.control && v.showControl"
            :emit="emit"
            :data="{ type: 'control', payload: v.control }"
            data-testid="input-control"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Ref } from 'rete-vue-plugin'

function sortByIndex(entries:any) {
  entries.sort((a:any, b:any) => {
    const ai = a[1] && a[1].index || 0
    const bi = b[1] && b[1].index || 0

    return ai - bi
  })
  return entries
}

// 这个自定义组件的width和height目前是错误的（视图层和数据层是不一致的）
export default defineComponent({
  name: 'ReteBasic',
  props: ['data', 'emit', 'seed'],
  components: {
    Ref
  },
  methods: {
    // nodeStyles() {
    //   return {
    //     width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
    //     height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
    //   }
    // },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs))
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls))
    },
    outputs() {
      return sortByIndex(Object.entries(this.data.outputs))
    }
  },
  setup(props) {
    console.log(props.data, props.emit, props.seed)
  }
})
</script>

<style lang="scss">
  .customized-node{
    border-radius: 4px;
    box-sizing: border-box;
    position: relative;
    * {
      user-select: none;
    }
    &.selected {
      .border {
        border: 2px solid #0772ff;
        filter: drop-shadow(0px 0px 4px rgba(7, 114, 255, 0.4));
      }
    }
    .border {
      position: absolute;
      width: 100%;
      height: 100%;
      left: -2px;
      top: -2px;
      border-radius: 6px;
    }
    .customized-title{
      width: 100%;
      height: 32px;
      padding: 0 8px;
      box-sizing: border-box;
      background: #1A1A1A;
      border-radius: 4px 4px 0 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: 32px;
      font-size: 14px;
      color: #fff;
      letter-spacing: 1px;
    }
    .customized-content{
      width: 100%;
      box-sizing: border-box;
      border-radius: 0 0 4px 4px;
      background: #232323;
      .content-block{
        padding-bottom: 8px;
        border-bottom: 1px solid #333333;
        &.align-right {
          text-align: right;
          padding-right: 8px;
          .content--socket-line{
            .socket-container {
              right: -13px; /* 8 + 5*/
            }
          }
        }
        &.align-left {
          text-align: left;
          padding-left: 8px;
          .content--socket-line{
            .socket-container {
              left: -13px; /* 8 + 5*/
            }
          }
        }
        &.no-next {
          border:none;
        }
        .content-block-title{
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          letter-spacing: 1px;
          color: #666;
        }
        .content--socket-line{
          position: relative;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          letter-spacing: 2px;
          color: #efefef;
          .socket-container {
            position: absolute;
            border-radius: 50%;
            top: 7px; /* 24 / 2 - 5 */
          }
        }
      }
    }
  }
</style>