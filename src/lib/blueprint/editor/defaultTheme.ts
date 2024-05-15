import { StarmapTheme, Level2StringInfo, StarmapDataType, StarmapNodeCategory } from "./define"

export const defaultTheme:StarmapTheme = {
  node: {
    style: {
      main: {
        width: '150px',
        minHeight: '60px',
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.6)'
      },
      selected: {
        border: '2px solid #0772ff',
        dropShadow: '0px 0px 4px rgba(7, 114, 255, 0.4)'
      },
      title: {
        height: '32px',
        padding: '0 8px',
        color: '#fff',
        fontSize: '14px',
        letterSpacing: '1px'
      },
      category: {
        paddingVeritical: '8px',
        paddingHorizontal: '8px',
        borderBottomNotLast: '1px solid #333333',
        socketOffset: '-12px'
      },
      blockTitle: {
        height: '24px',
        fontSize: '12px',
        letterSpacing: '1px',
        color: '#666666'
      },
      blockLine: {
        height: '24px',
        fontSize: '12px',
        letterSpacing: '2px',
        color: '#efefef'
      },
      socket: {
        top: '8px',
        size: '10px'
      }
    },
    themes: {
      gray: {
        id: 'gray',
        title: '#1a1a1a',
        content: '#232323',
        cateBorder: '#333333',
        thumb: '#333333'
      },
      blue: {
        id: 'blue',
        title: 'rgba(36, 123, 166, 0.8)',
        content: '#232323',
        cateBorder: '#333333',
        thumb: 'rgba(36, 123, 166, 0.8)'
      },
      orange: {
        id: 'orange',
        title: 'rgba(108, 83, 31, 0.8)',
        content: '#232323',
        cateBorder: '#333333',
        thumb: 'rgba(108, 83, 31, 0.8)'
      },
      green: {
        id: 'green',
        title: 'rgba(20, 93, 73, 0.8)',
        content: '#232323',
        cateBorder: '#333333',
        thumb: 'rgba(20, 93, 73, 0.8)'
      },
      purple: {
        id: 'purple',
        title: 'rgba(103, 55, 173, 0.8)',
        content: '#232323',
        cateBorder: '#333333',
        thumb: 'rgba(103, 55, 173, 0.8)'
      },
      brown: {
        id: 'brown',
        title: 'rgba(108, 58, 31, 0.8)',
        content: '#232323',
        cateBorder: '#333333',
        thumb: 'rgba(108, 58, 31, 0.8)'
      }
    }
  },
  connection: {
    style: {
      main: {
        stroke: '#fff',
        strokeWidth: '2.5px'
      },
      hover: {
        stroke: 'rgba(255, 255, 255, 0)',
        strokeWidth: '8px'
      },
      selected: {
        stroke: '#0772ff'
      },
      log: {}
    },
    themes: {}
  },
  socket: {
    style: {
      main: {
        border: '1px solid #000'
      }
    },
    themes: {
      boolean: {
        main: '#F35353'
      },
      string: {
        main: '#3DB900'
      },
      number: {
        main: '#009EF1'
      },
      object: {
        main: '#F1A900'
      },
      array: {
        main: '#C77EFF'
      },
      unknown: {
        main: '#444444'
      },
      null: {
        main: '#ffffff'
      }
    }
  },
  globalStyle: {}
}

let customTheme:StarmapTheme|undefined

export function computeNodeSizeByDefine(category:Array<StarmapNodeCategory>) {
  const style = getThemes().node.style
  let height = parseFloat(style.title.height)
  let debtHeight = 0 // 由于设置了halfLine而出现的高度降低
  category.forEach((cate, i) => {
    height += (category[i + 1] && !category[i + 1].label) ? 0 : parseFloat(style.category.paddingVeritical)
    if (cate.label) {
      height += parseFloat(style.blockTitle.height)
      if (i !== category.length) height += parseFloat(style.main.border.split(' ')[0]) // style.main.border
    } else if (!category[i - 1] || category[i - 1].label) height += parseFloat(style.category.paddingVeritical)
    // height += (cate.label ? parseFloat(style.blockTitle.height) : parseFloat(style.category.paddingVeritical))
    const blockHeight = computeBlockHeight(cate)
    if (debtHeight) {
      debtHeight -= blockHeight
      if (debtHeight < 0) {
        height -= debtHeight
        debtHeight = 0
      }
    } else height += blockHeight
    if (cate.halfline) debtHeight += blockHeight
  })
  // if (debtHeight) height += debtHeight
  return {
    width: parseFloat(style.main.width),
    height: Math.max(parseFloat(style.main.minHeight), height)
  }
}

// to do: 检查调用次数
export function computeBlockHeight(cate:StarmapNodeCategory) {
  const style = getThemes().node.style
  let height = 0
  cate.content.forEach(() => {
    // 遇到控件的情况，要根据一个控件高度计算工具，来具体计算高度
    height += parseFloat(style.blockLine.height)
  })
  return height
}

export function setThemes(theme:StarmapTheme) {
  customTheme = theme
}

export function getThemes():StarmapTheme {
  return customTheme || defaultTheme
}

export function getNodeTheme(themeName?:string):{ style: Level2StringInfo, theme: Record<string, string> } {
  const nodeThemes = getThemes().node
  const themes = nodeThemes.themes
  let theme:Record<string, string>|undefined
  if (themeName) {
    theme = themes[themeName]
  }
  if (!theme) theme = themes[Object.keys(themes)[0]]
  return {
    style: nodeThemes.style,
    theme
  }
}

export function getSocketTheme(dataType:StarmapDataType = StarmapDataType.UNKNOW) {
  const socketThemes = getThemes().socket
  const themes = socketThemes.themes
  return {
    style: socketThemes.style,
    theme: themes[dataType] || themes.unknown
  }
}