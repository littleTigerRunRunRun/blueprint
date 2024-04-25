<template>
  <div
    class="customized-group"
    :class="{ selected: data.selected }"
    :style="{
      width: `${data.width}px`,
      height: `${data.height}px`
    }"
    data-testid="node"
  >
    <div class="border" />
    <div class="customized-title">{{ data.label }}{{ data.id }}</div>
    <div class="customized-content">
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
    // console.log(props.data, props.emit, props.seed)
  }
})
</script>

<style lang="scss">
  .customized-group{
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
      background: #1a1a1a;
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
      height: calc(100% - 32px);
      box-sizing: border-box;
      border-radius: 0 0 4px 4px;
      background: rgba(35, 35, 35, 0.6);
    }
  }
</style>