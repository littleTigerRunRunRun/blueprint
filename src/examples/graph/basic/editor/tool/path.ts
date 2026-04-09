// 求从矩形某个边的中心出发，到另一个矩形某个边中心折线路径
// 要求1：折线为正交折线（只存在垂直和水平方向的线段）
// 要求2：每个矩形都有自己的宽高，折线不能和这两个矩形相交
// 要求3：可以对起点和终点的矩形设置padding值，用于设置路径绕行对应矩形时的间距
type Point = { x: number, y: number }
export type side = 't' | 'b' | 'l' | 'r'
type Rect = { x: number, y: number, width: number, height: number }
/**
 * 生成两个矩形边中心之间的正交避障折线路径
 * @param {Object} rectA - 起点矩形 { x, y, width, height } (x,y为矩形左上角坐标)
 * @param {string} sideA - 起点矩形边中心位置 't'/'b'/'l'/'r'
 * @param {number} paddingA - 起点矩形绕行间距
 * @param {Object} rectB - 终点矩形 { x, y, width, height }
 * @param {string} sideB - 终点矩形边中心位置 't'/'b'/'l'/'r'
 * @param {number} paddingB - 终点矩形绕行间距
 * @returns {Array} 路径坐标点数组 [ {x,y}, {x,y}, ... ]
 */
export function generateOrthogonalPath(rectA:Rect, sideA:side, paddingA:number, rectB:Rect, sideB:side, paddingB:number) {
  // 工具函数：获取矩形指定边的中心点坐标
  const getRectCenter = (rect:Rect, side:side) => {
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    switch (side) {
      case 't': return { x: cx, y: rect.y };
      case 'b': return { x: cx, y: rect.y + rect.height };
      case 'l': return { x: rect.x, y: cy };
      case 'r': return { x: rect.x + rect.width, y: cy };
      default: return { x: cx, y: cy };
    }
  };

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
  const startCenter = getRectCenter(rectA, sideA);
  const endCenter = getRectCenter(rectB, sideB);

  // 2. 计算整体是水平移动还是垂直移动
  // const directionHorizon = Math.abs(startCenter.x - endCenter.x) > Math.abs(startCenter.y - endCenter.y)
  const horizonPositive = endCenter.x > startCenter.x
  const verticalPositive = endCenter.y > startCenter.y

  // 3. 计算带padding的安全起点/终点（离开/靠近矩形的第一个点）
  const safeStart = getSafeOffsetPoint(startCenter, sideA, paddingA);
  const safeEnd = getSafeOffsetPoint(endCenter, sideB, paddingB);
  
  const points = [startCenter]

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
