import { type GetSchemes, ClassicPreset } from 'rete'
import { type VueArea2D } from 'rete-vue-plugin'
import { type ContextMenuExtra } from "rete-context-menu-plugin"

const socket = new ClassicPreset.Socket('socket')

export class Start extends ClassicPreset.Node<{}, { exec: ClassicPreset.Socket }, {}> {
  width = 180
  height = 90
  constructor() {
    super('Start')
    this.addOutput('exec', new ClassicPreset.Output(socket, '执行'))
  }

  execute(input: '', forward: (output:'exec') => void) {
    forward('exec')
  }
}

export class Log extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket },
  { message: ClassicPreset.InputControl<"text"> }
> {
  width = 180
  height = 160
  constructor(message: string, private log: (text: string) => void) {
    super("Log")
    const control = new ClassicPreset.InputControl("text", {
      initial: message
    })

    this.addInput("exec", new ClassicPreset.Input(socket, "执行", true))
    this.addControl("message", control)
    this.addOutput("exec", new ClassicPreset.Output(socket, "执行"))
  }

  execute(input: "exec", forward: (output: "exec") => void) {
    this.log(this.controls.message.value as string)

    forward("exec")
  }
}

export class Delay extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  width = 180
  height = 160

  constructor(seconds: number) {
    super('Delay')
    this.addInput('exec', new ClassicPreset.Input(socket, "执行", true))
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: seconds })
    )
    this.addOutput("exec", new ClassicPreset.Output(socket, "执行"))
  }

  execute(input: "exec", forward: (output: "exec") => void) {
    const value = this.controls.value.value
    setTimeout(
      () => {
        forward("exec")
      },
      value ? value * 1000 : 1000
    )
  }
}

type Node = Start | Log | Delay

export class Connection<
  A extends Node, B extends Node
> extends ClassicPreset.Connection<A, B> {
  isLoop?: boolean
}

export type Schemes = GetSchemes<
  Node,
  Connection<Start, Log>
  | Connection<Delay, Log>
  | Connection<Log, Delay>
  | Connection<Log, Log>
  | Connection<Delay, Delay>
>
export type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra