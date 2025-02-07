// 阻断事件传递，防止输入框内的selection操作呗上层覆盖
export const customPointerDown = (event:React.MouseEvent) => {
  event.stopPropagation()
}