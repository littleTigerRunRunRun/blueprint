
/*** 指定背景 ***/
// 纯色
export function createPureBG(background: string) {
  return `background-color: ${background}`
}
// 点状
export function createPointBG(background: string, point: { interval: number, r: number, color: string }) {
  return `
    background: ${background};
    background-image: radial-gradient(circle at center, ${point.color} ${point.r * 0.6}px, transparent ${point.r * 1.2}px);
    background-size: ${point.interval}px ${point.interval}px;
  `
}
// 网格
export function createGridBG(background: string, mainGrid: { interval: number, width: number, color: string }, subGrid: { interval: number, width: number, color: string }) {
  return `
    background-color: ${background};
    background-image:
      linear-gradient(${mainGrid.color} ${mainGrid.width}px, transparent ${mainGrid.width}px),
      linear-gradient(90deg, ${mainGrid.color} ${mainGrid.width}px, transparent ${mainGrid.width}px),
      linear-gradient(${subGrid.color} ${subGrid.width}px, transparent ${subGrid.width}px),
      linear-gradient(90deg, ${subGrid.color} ${subGrid.width}px, transparent ${subGrid.width}px);
    background-size: ${mainGrid.interval}px ${mainGrid.interval}px, ${mainGrid.interval}px ${mainGrid.interval}px, ${subGrid.interval}px ${subGrid.interval}px, ${subGrid.interval}px ${subGrid.interval}px;
    background-position: -${mainGrid.width}px -${mainGrid.width}px, -${mainGrid.width}px -${mainGrid.width}px, -${mainGrid.width}px -${mainGrid.width}px, -${mainGrid.width}px -${mainGrid.width}px;
  `
}