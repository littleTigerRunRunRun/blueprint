import type { StarmapTheme, Level2StringInfo } from "./define"

export const defaultTheme:StarmapTheme = {
  node: {
    style: {
      main: {
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