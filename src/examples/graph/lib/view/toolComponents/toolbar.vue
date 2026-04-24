<template>
  <div
    class="graph-toolbar graph-toolbar-main"
    :class="[`direction-${setting.layoutDirection}`, setting.orientation, `style-${setting.style}`]"
    :style="dealToolbarStyle(setting)"
    >
    <template v-for="(tool, ti) in setting.content" :key="`tool_${ti}`">
      <ToolButton
        v-if="tool.type === 'button'"
        :tooltip="tool.tooltip"
        :placement="getTooltipPlacement(setting.orientation, setting.layoutDirection)"
        :size="setting.size"
        :icon="tool.icon"
      />
      <ToolDrag
        v-if="tool.type === 'drag'"
        :tooltip="tool.tooltip"
        :placement="getTooltipPlacement(setting.orientation, setting.layoutDirection)"
        :size="setting.size"
        :icon="tool.icon"
      />
      <ToolSwitch
        v-if="tool.type === 'switch'"
        :tooltip="tool.tooltip"
        :placement="getTooltipPlacement(setting.orientation, setting.layoutDirection)"
        :size="setting.size"
        :icon="tool.icon"
      />
      <ToolDrawer
        v-if="tool.type === 'drawer'"
        :tooltip="tool.tooltip"
        :placement="getTooltipPlacement(setting.orientation, setting.layoutDirection)"
        :size="setting.size"
        :icon="tool.icon || ''"
      />
      <div
        v-else-if="tool.type === 'seperate'"
        class="tool-seperate"
        :style="{
          width: `${setting.layoutDirection === 'h' ? tool.size1 : tool.size2}px`,
          height: `${setting.layoutDirection === 'h' ? tool.size2 : tool.size1}px`,
          margin: setting.layoutDirection === 'h' ? `0 ${tool.padding[1]}px 0 ${tool.padding[0]}px` : `${tool.padding[0]}px 0 ${tool.padding[1]}px 0`
        }"
      />
      <slot
        v-else-if="tool.type === 'custom'"
        :name="`${name}_tool_${tool.name}`"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import ToolButton from './tool-button.vue';
import ToolDrawer from './tool-drawer.vue'
import ToolDrag from './tool-drag.vue'
import ToolSwitch from './tool-switch.vue';
import type { ToolListSetting, OrientationSetting, LayoutDirection } from '../../define'

const { name, setting } = defineProps<{
  name:string
  setting: Required<ToolListSetting>
}>()

const dealToolbarStyle = (setting: Required<ToolListSetting>) => {
  // 将朝向配置中的top right bottom left解析出来
  const style:Record<string, string> = {}
  const keys = ['left', 'right', 'top', 'bottom']
  for (const key of keys) {
    const value = (setting.orientation as any)[key]
    style[key] = typeof value === 'number' ? `${value}px` : value
  }

  // 对于t b l r这四个方向，具有一些默认样式
  switch (setting.orientation.ori) {
    case 't':
    case 'b':
      style.left = '50%'
      style.transform = `translate(-50%, 0)`
      break
    case 'r':
    case 'l':
      style.top = '50%'
      style.transform = `translate(0, -50%)`
      break
  }

  // 将size解析成width和height
  if (setting.layoutDirection === 'v') {
    style.width = `${setting.size}px`
    style.writingMode = 'vertical-rl'
  } else {
    style.height = `${setting.size}px`
    style.lineHeight = `${setting.size}px`
  }

  return style
}

const getTooltipPlacement = (orientation: OrientationSetting, direction: LayoutDirection) => {
  switch (orientation.ori) {
    case 't': return 'bottom'
    case 'b': return 'top'
    case 'l': return 'right'
    case 'r': return 'left'
    case 'rt': {
      if (direction === 'v') return 'leftTop'
      else return 'topLeft'
    }
    case 'lb': {
      if (direction === 'v') return 'leftBottom'
      else return 'bottomLeft'
    }
    case 'rb': {
      if (direction === 'v') return 'rightBottom'
      else return 'bottomRight'
    }
    case 'lt': {
      if (direction === 'v') return 'leftTop'
      else return 'topLeft'
    }
    default: return 'left'
  }
}
</script>

<style lang="scss" scoped>

.graph-toolbar {
  position: absolute;
  box-sizing: content-box;
  &.style-icon{
    border-radius: 4px;
    background-color: #fff;
    font-size: 0px;
    white-space: nowrap;
    word-wrap: break-word;
    word-break: break-all;
    box-shadow: 0px 2px 14px 0px #05003814;
    &.direction-v {
      padding: 6px 4px;
    }
    &.direction-h {
      width: auto;
      padding: 4px 6px;
    }
    .graph-toolbar-main {
      box-shadow: 0px 2px 14px 0px #05003814;
    }
    .tool-seperate {
      display: inline-block;
      vertical-align: middle;
      background-color: #CDCCD7;
    }
  }
}
</style>