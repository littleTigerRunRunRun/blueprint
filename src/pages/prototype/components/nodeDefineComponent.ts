import { StarmapControlType, StarmapDataType, StarmapSocketType } from '@/lib/blueprint/editor'
import type { StarmapNodeCategory } from '@/lib/blueprint/editor'

export const categoryComponent:Record<string, StarmapNodeCategory> = {
  Instantiate: {
    label: '',
    content: [
      {
        label: '实例化',
        name: 'new',
        type: 'input',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.NULL
      }
    ]
  },
  Position: {
    label: '',
    content: [
      {
        label: '位置',
        name: 'position',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.OBJECT,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '横坐标',
          name: 'x',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '纵坐标',
          name: 'y',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  },
  Centre: {
    label: '',
    content: [
      {
        label: '中心',
        name: 'centre',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.OBJECT,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '中心横坐标',
          name: 'cx',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '中心纵坐标',
          name: 'cy',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  },
  Arc: {
    label: '',
    content: [
      {
        label: '圆弧',
        name: 'arc',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.OBJECT,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '开始角度',
          name: 'startAngle',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '结束角度',
          name: 'setEndAngle',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  },
  Fill: {
    label: '',
    content: [
      {
        label: '填充',
        name: 'fill',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.STRING,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '透明度',
          name: 'fillOpacity',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  },
  Stroke: {
    label: '',
    content: [
      {
        label: '描边',
        name: 'stroke',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.OBJECT,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '描边颜色',
          name: 'strokeColor',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.STRING,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '描边透明度',
          name: 'strokeOpacity',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '描边宽度',
          name: 'strokeWidth',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  },
  Font: {
    label: '',
    content: [
      {
        label: '文本',
        name: 'font',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.OBJECT,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '字体',
          name: 'fontFamily',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.STRING,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '字号',
          name: 'fontSize',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '加粗',
          name: 'fontBold',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.BOOLEAN,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '色彩',
          name: 'fontColor',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.BOOLEAN,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '透明度',
          name: 'fontOpacity',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '横向对齐',
          name: 'fontAlign',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.STRING,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  },
  Radius: {
    label: '',
    content: [
      {
        label: '半径',
        name: 'r',
        type: 'both',
        flowType: StarmapSocketType.CONTROL,
        dataType: StarmapDataType.NUMBER,
        anthorFlowType: StarmapSocketType.DATA
      }
    ],
    extend: {
      activate: false,
      content: [
        {
          label: '内径',
          name: 'innerR',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        },
        {
          label: '外径',
          name: 'outerR',
          type: 'both',
          flowType: StarmapSocketType.CONTROL,
          dataType: StarmapDataType.NUMBER,
          anthorFlowType: StarmapSocketType.DATA
        }
      ]
    }
  }
}