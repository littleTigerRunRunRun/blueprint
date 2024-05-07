import { StarmapTheme } from "./define"

export const defaultTheme:StarmapTheme = {
  node: {
    style: {},
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
    style: {},
    themes: {}
  },
  socket: {
    style: {},
    themes: {}
  },
  globalStyle: {}
}

let customTheme:StarmapTheme|undefined

export function computeNodeSizeByDefine() {
  
}

export function setThemes(themes?:StarmapTheme) {
  if (themes) customTheme = themes
}

function getThemes():StarmapTheme {
  return customTheme || defaultTheme
}

export function getNodeTheme(themeName?:string):Record<string, string> {
  const nodeThemes = getThemes().node.themes
  let theme:Record<string, string>|undefined
  if (themeName) {
    theme = nodeThemes[themeName]
  }
  if (!theme) theme = nodeThemes[Object.keys(nodeThemes)[0]]
  return theme
}