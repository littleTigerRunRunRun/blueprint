import { Input } from 'antd'
import { UniControl } from '../../tool/uniNode'
import './Code.scss'
import { getControlTheme } from '../../defaultTheme'
import MonacoEditor from 'react-monaco-editor'
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { customPointerDown } from './tool'

export function CodeControlView(props: { data: UniControl }) {
  const theme = getControlTheme('code')

  const options:monacoEditor.editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true
    // roundedSelection: false,
    // readOnly: false,
    // cursorStyle: 'line',
    // automaticLayout: false 
  }

  let codeValue = '// type your code...'

  return <div
    className="starmap-view-code"
    style={{
      '--code-height': `${theme.size.height}`,
      // '--code-background-color': theme.color.background,
      // '--code-padding': `0 ${theme.size.paddingLeft}`,
      // '--code-font-size': `${theme.size.font}`,
      // '--code-font-color': `${theme.color.font}`,
      // '--code-placeholder-color': `${theme.color.placeholder}`,
      // '--code-line-height': `${parseFloat(theme.size.height) - parseFloat(theme.size.border) * 2}px`,
      // '--code-normal-border': `${theme.size.border} solid ${theme.color.normalBorder}`,
      // '--code-focus-border': `${theme.size.border} solid ${theme.color.focusBorder}`,
      // '--code-border-radius': `${theme.size.borderRadius}`,
      // '--code-normal-shadow': `${theme.color.normalShadow}`
    } as React.CSSProperties}
    onPointerDown={customPointerDown}
  >
    <MonacoEditor
      width="100%"
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={codeValue}
      options={options}
    />
  </div>
}