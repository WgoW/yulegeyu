import type { BlockType } from '@/core/types.ts'

// 插槽区对象
export class SlotArea {
  slotAreaVal: Array<BlockType | null>
  composeNum: number // 几个相同的type就会消除掉

  constructor(size: number, composeNum: number) {
    console.log('初始化 SlotArea', size, composeNum)
    // 初始化插槽区大小,并填充null
    this.slotAreaVal = Array.from<BlockType | null>({ length: size }).fill(null)
    this.composeNum = composeNum
  }

  /**
   * 获取插槽区中指定类型的块数量
   * @param type 块类型
   */
  getTypeCount = (type: string): number => this.slotAreaVal.reduce(
    (acc, obj) => {
      return (obj && obj.type === type) ? acc + 1 : acc
    },
    0,
  )

  /**
   * 获取插槽区中null的数量
   */
  getNullCount = (): number => this.slotAreaVal.reduce(
    (acc, obj) => {
      return (obj === null) ? acc + 1 : acc
    },
    0,
  )

  /**
   * 添加一个块到插槽区
   * @param block
   * @param needRefresh 需要刷新react useState
   * @param onCompose 触发了消除的回调
   */
  addBlock(
    block: BlockType,
    needRefresh: (value: Array<BlockType | null>) => void,
    onCompose: () => void,
  ): void {
    // 当前插槽区内的类型数量
    const count = this.getTypeCount(block.type)
    // 满足消除条件
    if (count + 1 >= this.composeNum) {
      // 创建一个空的插槽区
      const newSlotArea: Array<BlockType | null> = []
      for (const value of this.slotAreaVal) {
        if (value) {
          if (value.type === block.type) {
            value.status = 2 // 将块的状态更新为已消除
          }
          else {
            newSlotArea.push(value)// 将不等于当前type的块添加到新数组中
          }
        }
      }
      // 新数组长度补齐到插槽区大小
      while (newSlotArea.length < this.slotAreaVal.length) {
        newSlotArea.push(null)
      }
      this.slotAreaVal = newSlotArea
      onCompose()
    }
    else {
      this.addRightBlock(block)
    }
    needRefresh(this.cloneSlotAreaVal())
  }

  /**
   * 往插槽区的右边补充一个block,并不是往右边补充,而是找到一个null,给替换掉
   */
  addRightBlock(block: BlockType) {
    for (let i = 0; i < this.slotAreaVal.length; i++) {
      if (this.slotAreaVal[i] === null) {
        this.slotAreaVal[i] = block
        break
      }
    }
  }

  /**
   * 从插槽区左边移除一个块,并将右边的所有块左移一位
   * @needRefresh 需要刷新react useState
   * @return 没有可以移除的,就返回null
   */
  rmLeftBlock(needRefresh: (value: Array<BlockType | null>) => void): BlockType | null {
    const temp = this.slotAreaVal[0]
    const newSlotArea = this.slotAreaVal.slice(1)
    newSlotArea.push(null)// 往右边补充一个null
    this.slotAreaVal = newSlotArea
    needRefresh(this.cloneSlotAreaVal())
    return temp
  }

  /**
   * 从插槽区右边移除一个块,并将这个块返回
   * @needRefresh 需要刷新react useState
   * @return 没有可以移除的,就返回null
   */
  rmRightBlock(needRefresh: (value: Array<BlockType | null>) => void): BlockType | null {
    // 从后往前找到不为空的块
    for (let i = this.slotAreaVal.length - 1; i >= 0; i--) {
      if (this.slotAreaVal[i]) {
        const result = this.slotAreaVal[i]
        this.slotAreaVal[i] = null
        needRefresh(this.cloneSlotAreaVal())
        return result
      }
    }
    return null // 如果槽中本来没有块,就返回null
  }

  /**
   * 获取插槽区
   */
  getSlotAreaVal() {
    return this.slotAreaVal
  }

  /**
   * 克隆插槽区
   */
  cloneSlotAreaVal() {
    return [...this.slotAreaVal]
  }
}
