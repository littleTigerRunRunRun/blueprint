<template>
  <a-button
    @pointerdown.stop=""
    @dblclick.stop=""
    @click="data.onClick"
  >{{data.label}}</a-button>
</template>

<script>
import { Button } from "ant-design-vue";

export default {
  props: ['data'],
  created() {
  },
  components: {
    AButton: Button
  }
}
</script>
  