
/*** 指定背景 ***/
// 纯色
export function createPureBG(background: string) {
  return `background-color: ${background};`
}
// 点状
export function createPointBG(background: string, point: { interval: number, r: number, color: string }) {
  return `
    background: ${background};
    background-image: radial-gradient(circle at center, ${point.color} ${point.r * 0.6}px, transparent ${point.r * 1.2}px);
    background-size: ${point.interval}px ${point.interval}px;
  `
}
// 网格
export function createGridBG(background: string, mainGrid: { interval: number, width: number, color: string }, subGrid: { interval: number, width: number, color: string }) {
  return `
    background-color: ${background};
    background-image:
      linear-gradient(${mainGrid.color} ${mainGrid.width}px, transparent ${mainGrid.width}px),
      linear-gradient(90deg, ${mainGrid.color} ${mainGrid.width}px, transparent ${mainGrid.width}px),
      linear-gradient(${subGrid.color} ${subGrid.width}px, transparent ${subGrid.width}px),
      linear-gradient(90deg, ${subGrid.color} ${subGrid.width}px, transparent ${subGrid.width}px);
    background-size: ${mainGrid.interval}px ${mainGrid.interval}px, ${mainGrid.interval}px ${mainGrid.interval}px, ${subGrid.interval}px ${subGrid.interval}px, ${subGrid.interval}px ${subGrid.interval}px;
    background-position: -${mainGrid.width}px -${mainGrid.width}px, -${mainGrid.width}px -${mainGrid.width}px, -${mainGrid.width}px -${mainGrid.width}px, -${mainGrid.width}px -${mainGrid.width}px;
  `
}

function parseColor(colorStr:string) {
  if (!colorStr || typeof colorStr !== 'string') {
      throw new Error('Invalid input');
  }

  // 去除空格并转为小写，方便处理
  const str = colorStr.replace(/\s/g, '').toLowerCase();

  // 处理 rgb(r,g,b) 格式
  if (str.startsWith('rgb(') && str.endsWith(')')) {
      const content = str.slice(4, -1);
      const parts = content.split(',');
      if (parts.length !== 3) {
          throw new Error('Invalid RGB format');
      }
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      

      if ([r, g, b].some(v => isNaN(v) || v < 0 || v > 255)) {
          throw new Error('RGB values out of range');
      }
      return { r, g, b };
  }

  // 处理十六进制格式 #fff 或 #ffffff
  let hex = str;
  if (hex.startsWith('#')) {
      hex = hex.slice(1);
  }

  // 验证十六进制字符
  if (!(/[0-9a-f]+$/.test(hex))) {
      throw new Error('Invalid hex characters');
  }

  if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) {
      throw new Error('Invalid hex length');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

// 生成内阴影
export function createInnerShadow(color: string, intensity: 1 | 2 | 3) {
  // 目前内阴影是由一组复杂的复合阴影组成，无法简单用几个参数描述，因此这里聚合成了intensity这个参数，它描述了内阴影的大小、位移、模糊、透明度等参数的集合，最终效果会给人感觉强度上能分为肉眼可见的3档
  const { r, g, b } = parseColor(color)
  switch (intensity) {
    case 1: {
      return `
        box-shadow:
          inset 1px 0 2px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 1px 2px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset -1px 0 2px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 -1px 2px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0px 0 1px 0 rgba(${r}, ${g}, ${b}, 0.1);
      `
    }
    case 2: {
      return `
        box-shadow:
          inset 3px 0 4px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 3px 4px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset -3px 0 4px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 -3px 4px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0px 0 3px 0 rgba(${r}, ${g}, ${b}, 0.1),
          inset 0px 0 1px 0 rgba(${r}, ${g}, ${b}, 0.15);
      `
    }
    case 3: {
      return `
        box-shadow:
          inset 5px 0 6px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 5px 6px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset -5px 0 6px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0 -5px 6px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0px 0 5px 0 rgba(${r}, ${g}, ${b}, 0.05),
          inset 0px 0 3px 0 rgba(${r}, ${g}, ${b}, 0.1),
          inset 0px 0 1px 0 rgba(${r}, ${g}, ${b}, 0.15);
      `
    }
  }
}