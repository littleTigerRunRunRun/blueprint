import { subscriber } from './tools/Subscriber'
import type { GCSParams, GCSTools, GCSArrayTools, GCSToolUseParam, GCSApp, GE, BaseGraphDefine, GCSO, GCSA, GraphExecutor, Callback } from './define'
import { GCS, GraphExec } from './define'
import GraphVue from './Graph.vue'
import { createGridBG, createPointBG, createPureBG, createInnerShadow } from './tools/GCSTools'
import { KeyboardManager } from './tools/keyborad'

export * from './define'
export * from './view'
export * from './editor'

// 用户自定义内容工具的总入口
export class GraphApp<T extends BaseGraphDefine> implements GCSApp<BaseGraphDefine> {
  public tools:GCSTools = {}
  public arrayTools:GCSArrayTools = {}
  // public icons:Record<string, string> = {}
  public exec: Record<GraphExec | string, Callback> = {}
  private _container:HTMLDivElement|null = null
  public set container(val:HTMLDivElement|null) {
    this._container = val
    if (val) {
      subscriber.set('exec', this.exec)
      this.onReady(val)
    }
  }
  public get container() {
    return this._container
  }
  
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
        const { name, size, orientation = { ori: 't', top: '10%' }, layoutDirection = 'h', style = 'icon', content } = param
        this.pushTool(GCS.TL, {
          name,
          size,
          orientation,
          layoutDirection,
          style,
          content
        })
        break
      }
      case 'keyboard':
        KeyboardManager(param)
        break
      case 'exec':
        for (const ex of param) {
          this.exec[ex.name] = ex.exec
        }
        break
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

  // 给用户自己替换的
  public onReady = (container: HTMLDivElement) => {
    console.log('ready', container)
  }

  // 定义图的各种图元的数据结构
  // public defineGraph(element:GE, name:string, dataDefine:any) {

  // }

  // public defineIcons(icons: Record<string, string>) {
  //   for (const key in icons) {
  //     this.icons[key] = icons[key]
  //   }
  // }

  // public getIcon(icon: string) {
  //   const iconUrl = this.icons[icon]
  //   if (!iconUrl) console.error(`找不到名为${icon}的icon资源`)
  //   return iconUrl || ''
  // }
}

export const app = new GraphApp()

export { GraphVue as Graph }