<template>
  <div
    class="graph-node-text"
  >
    <div
      :style="{
        width: `${data!.width}px`,
        height: `${data!.height}px`
      }"
      :class="{
        selected: data?.selected
      }"
    >
      <!-- <span
        class="text"
        :style="{
          lineHeight: `${data!.height}px`
        }"
        :contenteditable="canEdit"
        @pointerdown.stop="handlePointerDown"
        @pointerup.stop="handlePointerUp"
        @dblclick.stop="handleDBClick"
        @input="handleChange"
        @blur="handleBlur"
      >{{ data?.label }}</span> -->
      <span
        class="text"
        :style="{
          lineHeight: `${data!.height}px`
        }"
        contenteditable="true"
        @input="handleChange"
      >{{ data?.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { subscriber } from '../tool/Subscriber';
import { UniNode } from '../tool/uniNode'
import { ref, onUpdated } from 'vue'

const { data } = defineProps({
  data: UniNode
})
const vueemit = defineEmits(['update:data'])
const canEdit = ref(false)

const handleBlur = () => {
  canEdit.value = false
  if (data) { 
    data.edit = false
    data.selected = false
  }
}

const handleChange = (val:InputEvent) => {
  // @ts-ignore
  const text = val?.target?.innerText
  if (data) data.label = text
}

// to do: 由于retejs node 容器被点击后就会立即刷新dom，这会导致内部的dbclick根本无法触发（每次dbclick还没结束dom就被销毁了），想要实现双击编辑的功能必须先解决这个问题

// 这是一个解决方案，用于解决retejs底层渲染逻辑带来的问题，该问题是：点击选中节点时会触发update函数导致dom刷新，导致无法触发双击（双击的原dom目标消失）
// 为了解决这个问题，我们首先要把需要双击操作部分的dom内容的pointerup和pointerdown事件给停止冒泡
// 然后以100ms为界，假如100ms前触发了双击事件，则完全屏蔽pointetup和pointerdown的传递
// 如果100ms前触发了pointerup（和pointerdown一起构成了一次点击事件），暂存到100ms以后（不能立即处理因为100ms前双击事件和pointerup几乎会同时发生）
// 100ms时进行结算，如果没有双击过，把暂存的pointerdown和pointerup发出去（间隔20ms）
// const computeEventPosition = (event:MouseEvent):{ x:number, y: number } => {
//   const trans = subscriber.get('connectionSelector').area.area.transform
//   return {
//     x: (event.clientX - trans.x) / trans.k,
//     y: (event.clientY - trans.y) / trans.k
//   }
// }

// let downtime = 0
// let dbclicked = false
// let storageUpEventData:any
// let storageDownEventData:any
// let timeout:any
// const limittime = 300 // 100ms为界
// const handlePointerDown = (event:MouseEvent) => {
//   if (canEdit.value) return
//   if (downtime === 0) downtime = Date.now()
//   storageDownEventData = { position: computeEventPosition(event), event }
//   if (timeout) return
//   timeout = setTimeout(() => {
//     timeout = null
//     downtime = 0
//     if (dbclicked) {
//       dbclicked = false
//       return
//     } else {
//       // const area = subscriber.get('connectionSelector').area
//       // area.emit({
//       //   type: 'pointerdown',
//       //   data: storageDownEventData
//       // })
//       const element = storageDownEventData.event.target.parentElement.parentElement.parentElement
//       const pointerdownEvent = new PointerEvent('pointerdown', {
//         bubbles: true,
//         cancelable: true
//       })
//       element.dispatchEvent(pointerdownEvent)
//       if (storageUpEventData) {
//         const pointerupEvent = new PointerEvent('pointerup', {
//           bubbles: true,
//           cancelable: true
//         })
//         element.dispatchEvent(pointerupEvent)
//       }
//     }
//   }, limittime)
// }

// const handlePointerUp = (event:MouseEvent) => {
//   const delt = Date.now() - downtime
//   if (dbclicked || delt < limittime) {
//     storageUpEventData = { position: computeEventPosition(event), event }
//     return
//   }
// }

// const handleDBClick = () => {
//   dbclicked = true
//   canEdit.value = true
//   if (data) { 
//     data.edit = true
//     data.selected = true
//   }
// }

</script>

<style lang="scss">
.graph-node-text {
  position: relative;
  left: 0;
  top: 0;
  width: 0px !important;
  height: 0px !important;
  pointer-events: none;
  .selected{
    border: 1px solid #1890ff;
  }
  >div{
    pointer-events: auto;
    text-align: center;
  }
  .text{
    pointer-events: auto;
    user-select: none;
    cursor: auto;
    font-size: 14px;
    white-space: nowrap;
    word-break: break-all;
    word-wrap: break-word;
    &:focus-visible {
      border: none;
      outline: none;
      padding: 0;
      background-color: rgba(0, 0, 0, 0.1)
    }
  }
}
</style>
