import { useEffect, useState, useRef } from 'react'
import { starmap, type StarmapEditor } from './editor'
import './index.scss'
import { BlueprintToolbar } from './tools'
import { StarmapExec, StarmapNodeDefine, StarmapNodeCategory } from './editor/define'

declare interface BlueprintProps {
  dragging: StarmapNodeDefine|null
  checkInstanceNumChange: (name:string, change:number) => void
}

function Blueprint(props:BlueprintProps) {
  const container = useRef<HTMLDivElement>(null)
  const [opening, setOpening] = useState(false)
  const [editor, setEditor] = useState<StarmapEditor>()
  // let editor:StarmapEditor

  useEffect(() => {
    if (container.current && !editor) {
      // 初始化蓝图
      starmap({
        container: container.current,
        // 回调事件响应
        eventHandlers: {
          onNodeAdd: (node) => {
            // 这里改变了有限次数节点的调用次数，当调用次数为0时，对应的节点将无法被拖拽
            props.checkInstanceNumChange(node.name, -1)
          },
          onNodeRemove: (node) => {
            props.checkInstanceNumChange(node.name, 1)
          }
        }
      }, {
        // 这两个工具方法，提供了为用户自定义导入导出后续的入口
        getImportData: async () => {
          const namespace = location.search.split('?')[1].split('=')[1] || ''
          const dataString = localStorage[`starmap_data_${namespace}`]
          return dataString ? JSON.parse(dataString) : { nodes: [], connections: [], transform: { x: 0, y: 0, scale: 1 } }
        },
        exportCallback: (data) => {
          const namespace = location.search.split('?')[1].split('=')[1] || ''
          console.log(`starmap_data_${namespace}:`, data)
          localStorage[`starmap_data_${namespace}`] = JSON.stringify(data)
        }
      }).then((edit) => {
        // 这里代表画布已经准备完毕了
        setOpening(true)
        setEditor(edit)
        // editor = edit
      })
    }

    if (editor) {
      // 当editor创建完毕时，可以导入数据了
      editor.callExec[StarmapExec.IMPORT]()
    }
    
    return () => {
      if (editor) editor.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  function dropAdd() {
    editor?.dropAdd(props.dragging)
  }

  // 拖拽加入内容
  useEffect(() => {
    dropAdd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dragging])

  return (
    <div className="blueprint-container">
      <BlueprintToolbar callExec={editor?.callExec} />
      <div className={`blueprint-ref ${opening ? 'show' : ''}`} ref={container} />
    </div>
  )
}

export default Blueprint