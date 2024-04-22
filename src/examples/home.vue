<template>
  <!-- <diagram /> -->
  <div class="home">
    <div class="title">retejs基础案例演示</div>
    <div class="content">
      <router-link to="/rete-basic">
        <div class="example">
          <img src="../assets/basic.png" />
          <span>rete基础编辑器</span>
        </div>
      </router-link>
      <router-link to="/rete-control">
        <div class="example">
          <img src="../assets/control.png" />
          <span>自定义控件</span>
        </div>
      </router-link>
      <router-link to="/rete-dataflow">
        <div class="example">
          <img src="../assets/dataflow.png" />
          <span>数据流</span>
        </div>
      </router-link>
      <router-link to="/rete-controlflow">
        <div class="example">
          <img src="../assets/controlflow.png" />
          <span>控制流</span>
        </div>
      </router-link>
      <router-link to="/rete-hybrid">
        <div class="example">
          <img src="../assets/hybrid.png" />
          <span>混合流</span>
        </div>
      </router-link>
      <router-link to="/rete-customization">
        <div class="example">
          <img src="../assets/hybrid.png" />
          <span>自定义样式</span>
        </div>
      </router-link>
    </div>
    <div class="title">蓝图编辑器子功能预研演示</div>
    <div class="content">
      <router-link to="/ast-basic">
        <div class="example">
          <img src="../assets/controlflow.png" />
          <span>AST解析示例</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    return {}
  }
})
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
.home{
  width: 100%;
  height: 100%;
  .title{
    padding: 40px 0 0 40px;
    font-size: 24px;
  }
  .content{
    margin: 20px 0 0 0;
    padding: 0 40px;
    .example {
      width: 300px;
      height: 220px;
      cursor: pointer;
      display: inline-block;
      margin: 0 20px 20px 0;
      &:hover{
        span {
          color: #d33333;
        }
      }
      img {
        width: 300px;
        height: 190px;
        box-shadow:
          0 0 5px 1px rgba(0, 0, 0, 0.1),
          0 2px 3px 0px rgba(0, 0, 0, 0.1),
          0 1px 2px 0px rgba(0, 0, 0, 0.2),
          0 1px 1px 0px rgba(0, 0, 0, 0.3)
          ;
      }
      span {
        transition: color 0.3s;
        font-size: 16px;
        color: #3399ff;
      }
    }
  }
}
</style>
