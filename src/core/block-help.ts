import _ from 'lodash'
import type { BlockType, GameConfigType } from '@/core/types.ts'

/**
 * 多个随机区 的 总块数
 * @param gameConfig
 */
export function calcTotalRandomBlockNum(gameConfig: GameConfigType): number {
  return gameConfig.randomBlocks.reduce(
    (pre: number, curr: number) => pre + curr,
    0,
  )
}

/**
 * 生成所有块,并返回
 */
export function genBlocks(gameConfig: GameConfigType) {
  //* **************** 1. 规划块数 *****************
  // 块数单位（总块数必须是该值的倍数） 合成数 * 动物数
  const blockNumUnit = gameConfig.composeNum * gameConfig.typeNum
  console.log('块数单位', blockNumUnit)
  // 随机生成的总块数
  const totalRandomBlockNum = calcTotalRandomBlockNum(gameConfig)
  console.log('随机生成的总块数', totalRandomBlockNum)

  // 需要的最小块数 层数 * 每层块数 + 随机区块数
  const minBlockNum = gameConfig.levelNum * gameConfig.levelBlockNum + totalRandomBlockNum
  console.log('需要的最小块数', minBlockNum)

  let totalBlockNum: number
  // 向上补齐到 blockNumUnit 的倍数
  // e.g. minBlockNum = 14, blockNumUnit = 6, 补到 18
  if (minBlockNum % blockNumUnit === 0) {
    totalBlockNum = minBlockNum
  }
  else {
    totalBlockNum = (Math.floor(minBlockNum / blockNumUnit) + 1) * blockNumUnit
  }
  //* **************** 2. 初始化块，随机生成块的内容 *****************
  // 保存所有块动物的数组
  const animalBlocks: string[] = []
  // 需要用到的动物数组
  const needAnimals = gameConfig.animals.slice(0, gameConfig.typeNum)
  // 依次把块塞到数组里
  for (let i = 0; i < totalBlockNum; i++) {
    animalBlocks.push(needAnimals[i % gameConfig.typeNum])
  }
  // 打乱数组
  const randomAnimalBlocks = _.shuffle(animalBlocks)

  const allBlocks: BlockType[] = []
  // 初始化
  for (let i = 0; i < totalBlockNum; i++) {
    const newBlock: BlockType = {
      id: i,
      x: 0, // 暂时为0
      y: 0, // 暂时为0
      status: 0,
      level: 0,
      type: randomAnimalBlocks[i],
      downBlocks: [],
      upBlocks: [],
    }
    allBlocks.push(newBlock)
  }
  return {
    allBlocks,
    totalRandomBlockNum,
  }
}

/**
 * 获取随机块
 * @param gameConfig
 * @param allBlocks 所有块(包含棋盘区的和随机区的块,随机区的在前面)
 * return {多个随机区的块,层叠区的块}
 */
export function getRandomBlocks(gameConfig: GameConfigType, allBlocks: BlockType[]) {
  // 3. 计算随机生成的块
  const randomBlocks: BlockType[][] = []
  let pos = 0 // 记录下标
  gameConfig.randomBlocks.forEach((randomBlock: number, idx: number) => {
    randomBlocks[idx] = []
    for (let i = 0; i < randomBlock; i++) {
      randomBlocks[idx].push(allBlocks[pos])
      pos++
    }
  })
  return {
    randomBlocks,
    levelBlocks: allBlocks.slice(pos),
  }
}

/**
 * 将层叠区分批
 * @param arr 要分割的数组
 * @param chunkSize 每批块数(大致)
 */
export function splitArray<T>(arr: T[], chunkSize: number): T[][] {
  if (arr.length === 0) {
    return []
  }
  if (chunkSize <= 0) {
    throw new Error('块的分割单位应该是正整数.')
  }
  if (chunkSize >= arr.length) {
    return [arr]
  }
  const firstChunk = arr.slice(0, chunkSize)
  return [firstChunk, ...splitArray(arr.slice(chunkSize), chunkSize)]
}
