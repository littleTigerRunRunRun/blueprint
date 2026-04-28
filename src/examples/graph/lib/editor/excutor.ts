import { type GraphExecutor, GraphExec } from "../define";
import { ReteEditor } from './rete'

export function createEditorExcutor(editor: ReteEditor):{
  excutor: GraphExecutor,
  destroy: () => void
} {
  return {
    excutor: {
      [GraphExec.EXPORT]: () => {

      },
      [GraphExec.IMPORT]: () => {

      },
      [GraphExec.CLEAR]: () => {

      },
      [GraphExec.DROP_ADD]: () => {

      },
      [GraphExec.DELETE_SELECT]: () => {

      },
      [GraphExec.ADD_NODE]: () => {

      }
    },
    destroy() {

    }
  }
}