import type { GCSParams, GCSTools, GCSToolUseParam, GCSApp, GE } from './define'
import { GCS } from './define'
import GraphVue from './Graph.vue'
export * from './define'

// 指定背景
// 纯色
function createPureBG(background: string) {
  return `background-color: ${background}`
}
// 点状
function createPointBG(background: string, point: { interval: number, r: number, color: string }) {
  return `
    background: ${background};
    background-image: radial-gradient(circle at center, ${point.color} ${point.r * 0.6}px, transparent ${point.r * 1.2}px);
    background-size: ${point.interval}px ${point.interval}px;
  `
}
// 网格
function createGridBG(background: string, mainGrid: { interval: number, width: number, color: string }, subGrid: { interval: number, width: number, color: string }) {
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

// 用户自定义内容工具的总入口
class GraphApp implements GCSApp {
  public tools:GCSTools = {}
  
  public set(...params: GCSToolUseParam) {
    const [name, param] = params
    switch (name) {
      case 'pureBG':
        this.placeTool(GCS.BG, createPureBG(param))
        break
      case 'pointBG':
        this.placeTool(GCS.BG, createPointBG(param.background, param.point))
        break
      case 'gridBG':
        this.placeTool(GCS.BG, createGridBG(param.background, param.mainGrid, param.subGrid))
        break
    }
  }

  // 放置工具，同GCS的工具之间会相互替换
  private placeTool<T extends GCS>(gcs:T, param:GCSParams[T]) {
    this.tools[gcs] = param
  }

  // 定义图的各种图元的数据结构
  public defineGraph(element:GE, name:string, dataDefine:any) {

  }

  // 定义资产
  public defineAsset() {

  }
}
export const app = new GraphApp()


export { GraphVue as Graph }