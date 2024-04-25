<template>
  <div class="rete-renderer">
    <div class="rete-details">基于AST的报错监听插入（处理内容见控制台）</div>
    <div class="rete-functions"></div>
    <div class="rete-renderer-container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { parse, type ParserOptions } from '@babel/parser'
import traverse, { type VisitNode } from '@babel/traverse'
import generate from '@babel/generator'
import * as bbt from '@babel/types'
// import { applyAstTransformations } from './ast/index'
// import worker from './worker?worker'
// console.log(worker)

export default defineComponent({
  name: 'ReteRenderer',
  setup() {
    const containerRef:Ref<HTMLElement|undefined> = ref(undefined)

    // 向渲染器中注入基本的节点、连接的视图模板

    onMounted(async () => {
      const sourceCode = 'function main() {let a = 0;console.log(b)}main()'
        
      console.log('sourceCode:', sourceCode)
      console.log('执行原始代码', () => {
        eval(sourceCode)
      })
      const parseCode = parse(sourceCode, {
        sourceType: 'script',
        strictMode: false,
        errorRecovery: true
      }) as any;
      console.log('parse:', parseCode)
      
      const TryCatch = 'try{}catch(error){}'
      const insertHandler = 'console.log("自定义报错处理：", error)'
      console.log('TryCatch:', TryCatch)
      console.log('tryCatchHandler:', insertHandler)
      const tryCatchAST = parse(TryCatch) as any;
      const tryCatchHandler = parse(insertHandler)
      console.log('tryCatchAST', tryCatchAST)
      console.log('tryCatchHandlerAST', tryCatchHandler)
      traverse(tryCatchAST, {
        CatchClause(path:any) {
          console.log('path', path)
          path.node.body.body.push(tryCatchHandler.program.body[0])
        }
      })
      console.log('asserted try catch:', generate(tryCatchAST))

      let innerCode = [...parseCode.program.body[0].body.body]
      parseCode.program.body[0].body.body = [tryCatchAST]
      tryCatchAST.program.body[0].block.body.push(...innerCode)
      const generated = generate(parseCode)
      console.log('generated', generated)
      console.log('执行插入后代码', () => {
        eval(generated.code)
      })
    })

    return {
      containerRef
    }
  }
})
</script>

<style lang="scss">
.rete-renderer{
  width: 100%;
  height: 100%;
  .rete-details {
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #ccc;
  }
  .rete-functions {
    width: 100%;
    height: 30px;
  }
  .rete-renderer-container{
    width: 100%;
    height: calc(100% - 61px);
  }
}
</style>