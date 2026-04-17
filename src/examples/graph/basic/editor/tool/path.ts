// 求从矩形某个边的中心出发，到另一个矩形某个边中心折线路径
// 要求1：折线为正交折线（只存在垂直和水平方向的线段）
// 要求2：每个矩形都有自己的宽高，折线不能和这两个矩形相交
// 要求3：可以对起点和终点的矩形设置padding值，用于设置路径绕行对应矩形时的间距
import type { side, Rect, Point } from '../define'


// 工具函数：获取矩形指定边的中心点坐标
export const getRectCenter = (rect:Rect, side:side, anchor?:Point) => {
  const cx = rect.x + rect.width * (anchor?.x || 0.5);
  const cy = rect.y + rect.height * (anchor?.y || 0.5);
  switch (side) {
    case 't': return { x: cx, y: rect.y };
    case 'b': return { x: cx, y: rect.y + rect.height };
    case 'l': return { x: rect.x, y: cy };
    case 'r': return { x: rect.x + rect.width, y: cy };
    default: return { x: cx, y: cy };
  }
};

// 生成两个矩形边中心之间的正交避障折线路径
export function generateOrthogonalPath(rectA:Rect, sideA:side, paddingA:number, rectB:Rect, sideB:side, paddingB:number, startCenter:Point, endCenter:Point) {

  // 工具函数：获取方向偏移后的安全点（保证不与矩形相交）
  const getSafeOffsetPoint = (center:Point, side:side, padding:number) => {
    switch (side) {
      case 't': return { x: center.x, y: center.y - padding };
      case 'b': return { x: center.x, y: center.y + padding };
      case 'l': return { x: center.x - padding, y: center.y };
      case 'r': return { x: center.x + padding, y: center.y };
      default: return center;
    }
  };

  const getSecondSafePoint = (prevSafe:Point, side:side, rect:Rect, padding:number, hp:boolean, vp: boolean) => {
    switch (side) {
      case 't':
      case 'b':
        return { x: prevSafe.x + (hp ? 1 : -1) * (rect.width * 0.5 + padding), y: prevSafe.y }
      case 'l':
      case 'r':
        return { x: prevSafe.x, y: prevSafe.y + (vp ? 1 : -1) * (rect.height * 0.5 + padding) }
    }
  }

  // 1. 获取起点、终点的中心点
  // const startCenter = getRectCenter(rectA, sideA);
  // const endCenter = getRectCenter(rectB, sideB);

  // 2. 计算整体是水平移动还是垂直移动
  // const directionHorizon = Math.abs(startCenter.x - endCenter.x) > Math.abs(startCenter.y - endCenter.y)
  const horizonPositive = endCenter.x > startCenter.x
  const verticalPositive = endCenter.y > startCenter.y

  // 3. 计算带padding的安全起点/终点（离开/靠近矩形的第一个点）
  const safeStart = getSafeOffsetPoint(startCenter, sideA, paddingA);
  const safeEnd = getSafeOffsetPoint(endCenter, sideB, paddingB);
  
  const points = [startCenter]

  // to do: 某些交叉情况还是没处理，一种思路：让node move的逻辑上做一些限制，让连线节点不能靠近padding距离
  // to do: 当开始结束点的横向或者纵向距离小于paddingA + paddingB时，会出现反收缩的错误情况
  if ((sideA === 'r' && horizonPositive) || (sideA === 'l' && !horizonPositive)) {
    // 水平顺势，则出线不需要经过safeStart
    if ((sideB === 'b' && verticalPositive) || (sideB === 't' && !verticalPositive)) {
      points.push(
        safeStart,
        { x: safeStart.x, y: safeEnd.y},
      )
    } else if ((sideA === 'r' && sideB === 'l') || (sideA === 'l' && sideB === 'r')) {
      points.push(
        safeStart,
        { x: safeStart.x, y: safeEnd.y }
      )
    } else points.push({ x: safeEnd.x, y: safeStart.y })
  } else if ((sideA === 'r' && !horizonPositive) || (sideA === 'l' && horizonPositive)) {
    points.push(safeStart)
    if ((sideA === 'l' && sideB === 'r') || (sideA === 'r' && sideB === 'l')) {
      const y = safeStart.y + (paddingA + rectA.height * 0.5) * (verticalPositive ? 1 : -1)
      points.push(
        { x: safeStart.x, y },
        { x: safeEnd.x, y }
      )
    } else points.push({ x: safeStart.x, y: safeEnd.y })
  } else if ((sideA === 'b' && verticalPositive) || (sideA === 't' && !verticalPositive)) {
    // 跟前两种对称
    if ((sideB === 'r' && horizonPositive) || (sideB === 'l' && !horizonPositive)) {
      points.push(
        safeStart,
        { x: safeEnd.x, y: safeStart.y},
      )
    } else if ((sideA === 't' && sideB === 'b') || (sideA === 'b' && sideB === 't')) {
      points.push(
        safeStart,
        { x: safeEnd.x, y: safeStart.y }
      )
    } else points.push({ x: safeStart.x, y: safeEnd.y })
  } else {
    // if ((sideA === 'b' && !verticalPositive) || (sideA === 't' && verticalPositive)) 
    points.push(safeStart)
    if ((sideA === 't' && sideB === 'b') || (sideA === 'b' && sideB === 't')) {
      const x = safeStart.x + (paddingA + rectA.width * 0.5) * (horizonPositive ? 1 : -1)
      points.push(
        { x, y: safeStart.y },
        { x, y: safeEnd.y }
      )
    } else points.push({ x: safeEnd.x, y: safeStart.y })
  }
  
  points.push(safeEnd, endCenter);
  return points;
}

// 将规整的正交路径补完成有圆角拐角的路径
export function createRadiusOrthPath(points: Array<Point>, radius: number):string {
  if (points.length < 3 || radius === 0) {
    return points.reduce((prev, current, index) => {
      if (index === 0) return prev + `M${current.x},${current.y} `
      else return prev + `L${current.x},${current.y} `
    }, '')
  }
  let path = `M${points[0].x},${points[0].y} `
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const current = points[i]
    const next = points[i + 1]

    const pcLength = Math.hypot(prev.x - current.x, prev.y - current.y)
    const cnLength = Math.hypot(next.x - current.x, next.y - current.y)
    const r = Math.min(Math.min(radius, pcLength * 0.5), cnLength * 0.5)
    const point1 = {
      x: (prev.x * r + current.x * (pcLength - r)) / pcLength,
      y: (prev.y * r + current.y * (pcLength - r)) / pcLength
    }

    const point2 = {
      x: (next.x * r + current.x * (cnLength - r)) / cnLength,
      y: (next.y * r + current.y * (cnLength - r)) / cnLength
    }

    path += `L${[point1.x]},${point1.y} Q${current.x},${current.y} ${point2.x},${point2.y} `
  }
  path += `L${points[points.length - 1].x},${points[points.length - 1].y}`

  return path
}

// to do: 根据两边点的side重新计算expand的作用方式，现在只有某些方向的curve表现正常
export function createCurve(points:Array<Point>, expand: number) {
  let path = ''
  const usedExpand = Math.min(Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) * 0.35, expand)
  const center = [(points[0].x + points[1].x) * 0.5, (points[0].y + points[1].y) * 0.5]

  if (points[0].x + usedExpand * 2 < points[1].x) {
    path += `
      M${points[0].x},${points[0].y} 
      C${points[0].x + usedExpand},${points[0].y} ${points[0].x + usedExpand},${points[0].y} ${center[0]},${center[1]} 
      C${points[1].x - usedExpand},${points[1].y} ${points[1].x - usedExpand},${points[1].y} ${points[1].x},${points[1].y} 
    `
  } else {
    // usedExpand = expand
    const rate = Math.min((points[0].x + usedExpand * 2 - points[1].x) / usedExpand * 0.5, 1) || 0
    const yDirection = points[0].y < points[1].y ? 1 : -1
    path += `
      M${points[0].x},${points[0].y}
      C${points[0].x + usedExpand * (1 + rate)},${points[0].y + usedExpand * 0.5 * rate * yDirection} ${points[0].x + usedExpand * (1 + rate)},${points[0].y + usedExpand * 0.5 * rate * yDirection} ${center[0]},${center[1]} 
      C${points[1].x - usedExpand * (1 + rate)},${points[1].y - usedExpand * 0.5 * rate * yDirection} ${points[1].x - usedExpand * (1 + rate)},${points[1].y - usedExpand * 0.5 * rate * yDirection} ${points[1].x},${points[1].y} 
    `
  }

  return path
}