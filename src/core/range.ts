import _ from 'lodash'

/**
 * 坐标
 */
interface XY {
  x: number
  y: number
}

/**
 * 范围
 */
export class Range {
  start: XY
  end: XY

  constructor(start: XY, end: XY) {
    this.start = start
    this.end = end
  }

  /**
   * 收缩范围
   * @param batch 批次
   * @param step 收缩步长
   */
  shrink(batch: number, step: number): Range {
    const range = _.cloneDeep<Range>(this)
    switch (batch % 4) { // 每4批(对应4个方向)一个循环,第五批的算法和第一批一致
      case 0: // 第一批的起点x轴边界向右收缩
        range.start.x += step
        break
      case 1: // 第二批的终点y边界向上收缩
        range.end.y -= step
        break
      case 2: // 第三批的终点x边界向左收缩
        range.end.x -= step
        break
      default: // 第四批的起点y轴最向下边收缩
        range.start.y += step
    }
    return range
  }

  // 从范围中随机一个x坐标
  randomX(): number {
    return Math.floor(Math.random() * (this.end.x - this.start.x + 1)) + this.start.x
  }

  // 从范围中随机一个y坐标
  randomY(): number {
    return Math.floor(Math.random() * (this.end.y - this.start.y + 1)) + this.start.y
  }

  /**
   * 校验范围是否合法,至少有一格
   */
  isValid(): boolean {
    return this.start.x < this.end.x && this.start.y < this.end.y
  }

  /**
   * 范围上的格子数量(块的落子点)
   */
  getBoxNum(): number {
    // 横向坐标数*纵向坐标数 = 格子数
    return (this.end.x - this.start.x + 1) * (this.end.y - this.start.y + 1)
  }
}
