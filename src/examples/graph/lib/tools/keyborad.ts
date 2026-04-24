import keyboardJS from 'keyboardjs'
import type { Callback, GraphExec, GraphExecutor, KeyboardTool } from '../define'
import { subscriber } from './Subscriber'

// 键盘涉及到的快捷键一般是不需要进行传参的预置指令，它们往往有某种规则找到参数，比如查询已选中内容之类的
export function KeyboardManager(config:Array<{ key: string, exec: GraphExec | string }> ):KeyboardTool {
  // 辅助键，用于响应组合键指令，例如ctrl + c复制等等
  // 这个值为了方便查询，被我整合到了subsciber中，方便全局查询
  // const auxiliary = {
  //   ctrl: false,
  //   alt: false,
  //   shift: false,
  //   space: false
  // }
  const keyExec:Record<string, GraphExec | string> = {}
  const bindings:Array<[string, Callback, Callback|undefined]> = []

  const keyPress = (event:keyboardJS.KeyEvent|undefined) => {
    if (event && event.key === 'Control') {
      subscriber.set('auxiliary.ctrl', true)
    }
    if (event && event.key === 'Alt'){
      subscriber.set('auxiliary.alt', true)
    }
    if (event && event.key === 'Shift'){
      subscriber.set('auxiliary.shift', true)
    }
    if (event && event.code === 'Space'){
      subscriber.set('auxiliary.space', true)
    }
  }

  // 
  const keyRelease = (event:keyboardJS.KeyEvent|undefined) => {
    if (event && event.key === 'Control'){
      subscriber.set('auxiliary.ctrl', false)
    }
    if (event && event.key === 'Alt'){
      subscriber.set('auxiliary.alt', false)
    }
    if (event && event.key === 'Shift'){
      subscriber.set('auxiliary.shift', false)
    }
    if (event && event.code === 'Space'){
      subscriber.set('auxiliary.space', false)
    }
  }

  const commonBind = (event:keyboardJS.KeyEvent|undefined) => {
    const key = event?.key.toLowerCase()
    
    // to do: 类型不正确
    if (key && keyExec[key]) {
      const exec = subscriber.get('exec') as (GraphExecutor | null)
      if (exec) {
        exec[keyExec[key] as GraphExec]?.()
      }
    }
  }

  keyboardJS.bind('ctrl', keyPress, keyRelease)
  keyboardJS.bind('alt', keyPress, keyRelease)
  keyboardJS.bind('shift', keyPress, keyRelease)
  keyboardJS.bind('space', keyPress, keyRelease)

  for (const item of config) {
    keyExec[item.key] = item.exec
    keyboardJS.bind(item.key, commonBind)
  }

  return {
    // 检查辅助键状态
    // checkAuxiliary(key:'ctrl'|'alt'|'shift'|'space'):boolean {
    //   return auxiliary[key]
    // },
    // 绑定按键事件
    bindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback) {
      keyboardJS.bind(key, keyPressBind, keyReleaseBind)
      bindings.push([key, keyPressBind, keyReleaseBind])
    },
    unbindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback) {
      keyboardJS.unbind(key, keyPressBind, keyReleaseBind)
    },
    // 恢复sleep状态
    // awake() {

    // },
    // 让整个按键系统不响应交互
    // sleep() {

    // },
    destroy() {
      for (const binding of bindings) {
        keyboardJS.unbind(binding[0], binding[1], binding[2])
      }
      bindings.splice(0, bindings.length)
      keyboardJS.unbind('ctrl', keyPress, keyRelease)
      keyboardJS.unbind('alt', keyPress, keyRelease)
      keyboardJS.unbind('shift', keyPress, keyRelease)
      keyboardJS.unbind('space', keyPress, keyRelease)
    }
  }
}