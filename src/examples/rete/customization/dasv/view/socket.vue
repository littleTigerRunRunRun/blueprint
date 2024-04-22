<template>
  <div class="socket" :title="data.name"></div>
</template>

<script lang="ts">
  export default {
    props: ['data']
  }
</script>

<style lang="scss" scoped>
  @use "sass:math";
  
  .socket {
    cursor: pointer;
    border: 1px solid #000;
    width: 10px; /* 实际可触摸范围可以大于这个，到时候把瞬间触发范围做大一点 */
    height: 10px;
    border-radius: 5px;
    background: #999999;
    box-sizing: border-box;
    &:hover {
      background: #36C38E;
    }
  }
</style>