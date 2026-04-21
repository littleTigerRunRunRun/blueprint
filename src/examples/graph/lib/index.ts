import type { GCSParams, GCSTools, GCSToolUseParam, GCSApp, GE, BaseGraphDefine } from './define'
import { GCS } from './define'
import GraphVue from './Graph.vue'
import { createGridBG, createPointBG, createPureBG } from './tools/GCSTools'

export * from './define'


// 用户自定义内容工具的总入口
class GraphApp implements GCSApp<BaseGraphDefine> {
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
      case 'toolList': {
        const { name, orientation = 't', layoutDirection = 'h' } = param
        this.pushTool(GCS.TL, {
          name,
          orientation,
          layoutDirection
        })
        break
      }
    }
  }

  // 放置工具，同GCS的工具之间会相互替换
  private placeTool<T extends GCS>(gcs:T, param:GCSParams[T]) {
    this.tools[gcs] = param
  }

  private pushTool<T extends GCS>(gcs:T, param:GCSParams[T]) {
    if (!this.tools[gcs]) this.tools[gcs] = []
    if (this.tools[gcs] instanceof Array) this.tools[gcs].push(param)
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