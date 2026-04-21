import type { GCSParams, GCSTools, GCSArrayTools, GCSToolUseParam, GCSApp, GE, BaseGraphDefine, GCSO, GCSA } from './define'
import { GCS } from './define'
import GraphVue from './Graph.vue'
import { createGridBG, createPointBG, createPureBG, createInnerShadow } from './tools/GCSTools'

export * from './define'

// 用户自定义内容工具的总入口
class GraphApp implements GCSApp<BaseGraphDefine> {
  public tools:GCSTools = {}
  public arrayTools:GCSArrayTools = {}
  
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
      case 'innerShadow':
        this.placeTool(GCS.IS, createInnerShadow(param.color, param.intensity))
        break
      case 'toolList': {
        const { name, orientation = { ori: 't', top: '10%' }, layoutDirection = 'h', style = 'icon' } = param
        this.pushTool(GCS.TL, {
          name,
          orientation,
          layoutDirection,
          style
        })
        break
      }
    }
  }

  // 放置工具，同GCS的工具之间会相互替换
  private placeTool(gcs:GCSO, param:GCSParams[GCSO]) {
    this.tools[gcs] = param
  }

  private pushTool(gcs:GCSA, param:GCSParams[GCSA]) {
    if (!this.arrayTools[gcs]) this.arrayTools[gcs] = []
    if (this.arrayTools[gcs] instanceof Array) this.arrayTools[gcs].push(param)
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