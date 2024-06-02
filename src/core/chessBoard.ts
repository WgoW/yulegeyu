import type { BlockType, ChessBoardUnitType } from '@/core/types.ts'
import { Range } from '@/core/range.ts'

// 棋盘对象
export class ChessBoard {
  // 总共划分 24 x 24 的格子,格子比块要小，每个块占 3 x 3 的格子,每个块都在这个范围内活动，生成的起始 x 和 y 坐标范围均为 0 ~ 21
  xBoxCount = 24 //
  yBoxCount = 24 // 纵向24格

  blockXCount = 3 // 块占用的横向格子数 3格
  blockYCount = 3 // 块占用的纵向格子数 3格

  boxWidthPX = 14 // 格子的像素宽度
  boxHeightPX = 14 // 格子的像素高度

  boxList: ChessBoardUnitType[][] // 棋盘上的每一个格子

  constructor() {
    console.log('初始化棋盘')
    this.boxList = this.initChessBoard()
  }

  // 获取棋盘的宽高
  getSize() {
    return {
      width: this.xBoxCount * this.boxWidthPX,
      height: this.yBoxCount * this.boxHeightPX,
    }
  }

  // 获取棋盘中每个格子的宽高像素
  getBoxSize(): { boxWidthPX: number, boxHeightPX: number } {
    return {
      boxWidthPX: this.boxWidthPX,
      boxHeightPX: this.boxHeightPX,
    }
  }

  /**
   * 获取块落在在棋盘上的范围
   */
  getBlockInBoxRange(): Range {
    return new Range(
      { x: 0, y: 0 },
      {
        // 这里是为了逻辑更直观,先把格子数-1换算成坐标,减去3,就是块的左上角坐标,+1就是块的坐标
        // 24-1-3+1 = 21
        x: (this.xBoxCount - 1) - this.blockXCount + 1,
        y: (this.yBoxCount - 1) - this.blockYCount + 1,
      },
    )
  }

  /**
   * 初始化指定大小的棋盘(就是给二维数组先填充数据)
   */
  private initChessBoard(): ChessBoardUnitType[][] {
    const chessBoard = Array.from<ChessBoardUnitType[]>({ length: this.xBoxCount })
    for (let i = 0; i < this.xBoxCount; i++) {
      chessBoard[i] = Array.from({ length: this.yBoxCount })
      for (let j = 0; j < this.yBoxCount; j++) {
        chessBoard[i][j] = { blocks: [] } // 每个格子中有0个或多个块
      }
    }
    return chessBoard
  }

  /**
   * 将一个块改变坐标,随机放入棋盘中的任意位置
   */
  changeBlock(block: BlockType) {
    const range = this.getBlockInBoxRange()
    // 随机生成一个新坐标
    block.x = range.randomX()
    block.y = range.randomY()
    block.status = 0
    // 移除的是随机块的元素，移到层级区域
    if (block.level < 1) {
      block.level = 10000
    }
    this.genLevelRelation(block) // 重新生成层级关系
  }

  /**
   * 给块绑定层级关系（用于确认哪些元素是当前可点击的）
   * 核心逻辑：每个块压住和其坐标有交集棋盘格内所有 level 大于它的点，双向建立联系
   * @param block 每个块的状态
   */
  genLevelRelation(block: BlockType) {
    // 确定该块附近的格子坐标范围,因为一个块占3*3的格子,所以与块的有重叠区的坐标在如下范围:上下左右2个块
    // 第二个参数是确保坐标在棋盘范围内
    const minX = Math.max(block.x - 2, 0)// x最多上2个格子
    const minY = Math.max(block.y - 2, 0)// y最多上2个格子
    const maxX = Math.min(block.x + 2, this.xBoxCount - 2)// x最多下2个格子
    const maxY = Math.min(block.y + 2, this.yBoxCount - 2) // y最多下2个格子
    // 遍历该块附近的格子,找到最高层的块,然后和该块建立联系,并该块高一层
    let maxLevel = 0
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const relationBlocks = this.boxList[x][y].blocks
        // 如果这个格子里面有一个或者多个块
        if (relationBlocks.length > 0) {
          // 取当前位置最高层的块,越往后层，层级越高
          const maxLevelRelationBlock = relationBlocks[relationBlocks.length - 1]
          // 排除自己
          if (maxLevelRelationBlock.id === block.id) {
            continue
          }
          maxLevel = Math.max(maxLevel, maxLevelRelationBlock.level)
          block.downBlocks.push(maxLevelRelationBlock)
          maxLevelRelationBlock.upBlocks.push(block)
        }
      }
    }
    // 比最高层的块再高一层（初始为 1,就是周围没有任何块的情况下,你就是第一层,也暂时是最后一层）
    block.level = maxLevel + 1
  }

  /**
   * 生成一批层级块（坐标、层级关系）
   * @param blocks 块
   * @param range 块 的落子范围
   */
  genLevelBlockPos(blocks: BlockType[], range: Range) {
    let allowedOverlap = false // 不允许块的坐标重叠
    if (blocks.length > range.getBoxNum()) {
      console.log('落子区间不够')
      allowedOverlap = true // 那就只能允许重叠了
    }
    // 记录这批块的坐标，用于保证同批次元素不能完全重叠
    const currentPosSet = new Set<string>()
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      // 随机生成坐标
      let newPosX
      let newPosY
      let key
      while (true) {
        newPosX = range.randomX() // 从范围随机一个x坐标
        newPosY = range.randomY() // 从范围随机一个y坐标
        key = `${newPosX},${newPosY}`
        // 同批次元素不能完全重叠,(有例外,落子区间太少了)
        if (allowedOverlap || !currentPosSet.has(key)) {
          break
        }
      }
      this.boxList[newPosX][newPosY].blocks.push(block)
      currentPosSet.add(key)
      block.x = newPosX
      block.y = newPosY
      // 填充层级关系
      this.genLevelRelation(block)
    }
  }
}
