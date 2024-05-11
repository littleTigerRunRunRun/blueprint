import keyboardJS from 'keyboardjs'
import { Callback, AbilityHotKeyConfig, StarmapExec } from '../define'

export interface KeyBind {

}

// 键盘监听模块属于一个输入辅助类型的功能模块，因此不适宜做到蓝图内部插件，因为不参与图编辑的事件流
export function BlueprintKeyboard(config:Array<AbilityHotKeyConfig>, callExec:(exec:StarmapExec) => void) {
  const auxiliary = {
    ctrl: false,
    alt: false,
    shift: false,
    space: false
  }
  const keyExec:Record<string, StarmapExec> = {}

  const keyPress = (event:keyboardJS.KeyEvent|undefined) => {
    if (event && event.key === 'Control') auxiliary.ctrl = true
    if (event && event.key === 'Alt') auxiliary.alt = true
    if (event && event.key === 'Shift') auxiliary.shift = true
    if (event && event.code === 'Space') auxiliary.space = true
  }

  const keyRelease = (event:keyboardJS.KeyEvent|undefined) => {
    if (event && event.key === 'Control') auxiliary.ctrl = false
    if (event && event.key === 'Alt') auxiliary.alt = false
    if (event && event.key === 'Shift') auxiliary.shift = false
    if (event && event.code === 'Space') auxiliary.space = false
  }

  const commonBind = (event:keyboardJS.KeyEvent|undefined) => {
    const key = event?.key.toLowerCase()
    if (key && keyExec[key]) callExec(keyExec[key])
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
    checkAuxiliary(key:'ctrl'|'alt'|'shift'|'space'):boolean {
      return auxiliary[key]
    },
    // 绑定按键事件
    bindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback) {
      keyboardJS.bind(key, keyPressBind, keyReleaseBind)
    },
    unbindKey(key:string, keyPressBind:Callback, keyReleaseBind?:Callback) {
      keyboardJS.unbind(key, keyPressBind, keyReleaseBind)
    },
    // 整个按键系统的注销
    awake() {

    },
    sleep() {

    },
    destroy() {
      keyboardJS.unbind('ctrl', keyPress, keyRelease)
      keyboardJS.unbind('alt', keyPress, keyRelease)
      keyboardJS.unbind('shift', keyPress, keyRelease)
      keyboardJS.unbind('space', keyPress, keyRelease)
    }
  }
}