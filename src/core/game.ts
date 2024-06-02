// noinspection JSUnusedGlobalSymbols
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useGlobalConfig } from '@/core/globalStore.ts'
import type { BlockType } from '@/core/types.ts'
import { GameStatus } from '@/core/types.ts'
import { ChessBoard } from '@/core/chessBoard.ts'
import { genBlocks, getRandomBlocks, splitArray } from '@/core/block-help.ts'
import { SlotArea } from '@/core/slotArea.ts'

const { INIT, PLAYING, STOP_FAIL, STOP_WIN } = GameStatus

/**
 * 游戏逻辑 V2（不固定 level）
 */
export function useGame() {
  const { gameConfig } = useGlobalConfig()
  // 游戏状态： 初始化, 进行中,  失败结束, 胜利结束
  const [gameStatus, setGameStatus] = useState<GameStatus>(INIT)

  // 层叠区的块
  const [levelBlocksVal, setLevelBlocksVal] = useState<BlockType[]>([])
  // 随机区块
  const [randomBlocksVal, setRandomBlocksVal] = useState<BlockType[][]>([])
  // 插槽区
  const [slotAreaVal, setSlotAreaVal] = useState<Array<BlockType | null>>([])

  // 总块数
  let [totalBlockNum, setTotalBlockNum] = useState(0)

  // 已消除块数
  const [clearBlockNum, setClearBlockNum] = useState(0)
  // 初始化棋盘对象
  const chessBoardObj = useMemo(() => new ChessBoard(), [])
  const { boxWidthPX, boxHeightPX } = chessBoardObj.getBoxSize()
  // 初始化插槽区对象
  const slotAreaObj = useMemo(() => new SlotArea(gameConfig.slotNum, gameConfig.composeNum), [gameConfig])
  // 上一次点击的是否是随机区,避免有人点击随机区后撤回,卡bug看牌
  const [lastOpIsRandom, setLastOpIsRandom] = useState(false)

  // region 技能相关
  // 圣光
  const [isHolyLight, setIsHolyLight] = useState(false)
  // 透视 查看随机区的块
  const [canSeeRandom, setCanSeeRandom] = useState(false)

  // 设置棋盘所在容器的宽高
  const setParentSize = () => {
    const levelBoardDom: any = document.getElementsByClassName('level-board')
    const size = chessBoardObj.getSize()
    levelBoardDom[0].style.width = `${size.width}px`
    levelBoardDom[0].style.height = `${size.height}px`
  }

  /**
   * 不这样触发不了react的ui更新
   * @param block
   */
  const updateLevelBlock = (block: BlockType) => {
    levelBlocksVal.forEach((value, index) => {
      if (value.id === block.id) {
        levelBlocksVal[index] = { ...block }// 改变指针, 触发react更新
        setLevelBlocksVal([...levelBlocksVal])
      }
    })
  }

  /**
   * 游戏初始化
   */
  const initGame = () => {
    console.log('initGame', gameConfig)

    // 0. 设置父容器宽高
    setParentSize()
    // 生成所有的块
    const { allBlocks } = genBlocks(gameConfig)
    setTotalBlockNum(totalBlockNum = allBlocks.length)
    // 3. 获取随机区 的块
    const { randomBlocks, levelBlocks } = getRandomBlocks(gameConfig, allBlocks)
    // 4. 计算有层级关系的块
    // const levelBlocks: BlockType[] = []
    let range = chessBoardObj.getBlockInBoxRange()// 棋盘允许摆放块的范围
    // 分为 gameConfig.levelNum 批，依次生成，每批的边界不同
    const levelBlocksList = splitArray(levelBlocks, gameConfig.levelBlockNum)
    for (let i = 0; i < levelBlocksList.length; i++) {
      const blocks = levelBlocksList[i]
      // 生成块的坐标
      chessBoardObj.genLevelBlockPos(blocks, range)
      // levelBlocks.push(...blocks) // 将生成好坐标关系的块，添加到 levelBlocks 中
      // 边界收缩
      if (gameConfig.borderStep > 0) {
        const rangeTemp = range.shrink(i, gameConfig.borderStep)
        if (rangeTemp.isValid()) {
          range = rangeTemp
        }
        else {
          console.log('无法继续缩小边界')
        }
      }
    }
    console.log('随机块情况', randomBlocks)
    return {
      levelBlocks,
      randomBlocks,
    }
  }

  /**
   * 点击块事件
   * @param block
   * @param randomIdx 随机区域的下标,第几个随机区，>= 0 表示点击的是随机块
   * @param force 强制移除
   */
  const doClickBlock = (block: BlockType, randomIdx = -1, force = false) => {
    console.log('点击块', block)
    //  已经被点击 / 有上层块（且非强制和圣光），不能再点击
    if (block.status !== 0
      || (block.upBlocks.length > 0 && !force && !isHolyLight)
    ) {
      return
    }
    setIsHolyLight(false) // 如果开启了圣光点击的块，则关闭
    // 修改元素状态为已点击
    block.status = 1
    // 如果是随机区的块，则 移除当前元素
    if (randomIdx >= 0) {
      setLastOpIsRandom(true)
      const temp = JSON.parse(JSON.stringify(randomBlocksVal))
      console.log('随机区块', temp)
      randomBlocksVal[randomIdx] = [...randomBlocksVal[randomIdx].slice(1, randomBlocksVal[randomIdx].length)]
      const temp2 = JSON.parse(JSON.stringify(randomBlocksVal))
      setRandomBlocksVal(randomBlocksVal)
      console.log('随机区块2', temp2)
    }
    // 点击的层叠区的块
    else {
      setLastOpIsRandom(false)
      // 移除覆盖关系
      block.downBlocks.forEach((downBlock) => {
        _.remove(downBlock.upBlocks, upBlock => upBlock.id === block.id)
      })
    }
    // 新元素加入插槽
    slotAreaObj.addBlock(
      block,
      setSlotAreaVal,
      () => {
        // 已消除块数 增加
        setClearBlockNum(clearBlockNum + gameConfig.composeNum)
      },
    )
    // 插槽区没有空位了,游戏结束
    if (slotAreaObj.getNullCount() === 0) {
      setGameStatus(STOP_FAIL)
      setTimeout(() => {
        // eslint-disable-next-line no-alert
        alert('你输了')
      }, 2000)
    }
    if (clearBlockNum >= totalBlockNum) {
      setGameStatus(STOP_WIN)
    }
  }

  /**
   * 开始游戏
   */
  const doStart = () => {
    setGameStatus(INIT)
    const { levelBlocks, randomBlocks } = initGame()
    console.log(levelBlocks, randomBlocks)
    setLevelBlocksVal(levelBlocks)
    setRandomBlocksVal(randomBlocks)
    setSlotAreaVal(slotAreaObj.getSlotAreaVal())
    setGameStatus(PLAYING)
  }
  // region 技能

  /**
   * 洗牌
   *
   * @desc 随机重洗所有未被点击的块,只洗层叠区的块
   */
  const doShuffle = () => {
    // 遍历层叠去所有未消除的块
    const originBlocks = levelBlocksVal.filter(block => block.status === 0)
    const newBlockTypes = _.shuffle(originBlocks.map(block => block.type))
    let pos = 0
    originBlocks.forEach((block) => {
      block.type = newBlockTypes[pos++]
    })
    setLevelBlocksVal([...levelBlocksVal])
  }

  /**
   * 破坏
   *
   * @desc 消除一组层级块
   */
  const doBroke = () => {
    // 类型，块列表映射
    const typeBlockMap: Record<string, BlockType[]> = {}
    const blocks = levelBlocksVal.filter(block => block.status === 0)
    // 遍历所有未消除的层级块
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (!typeBlockMap[block.type]) {
        typeBlockMap[block.type] = []
      }
      typeBlockMap[block.type].push(block)
      // 有能消除的一组块
      if (typeBlockMap[block.type].length >= gameConfig.composeNum) {
        typeBlockMap[block.type].forEach((clickBlock) => {
          doClickBlock(clickBlock, -1, true)
        })
        console.log('doBroke', typeBlockMap[block.type])
        break
      }
    }
  }

  /**
   * 撤回
   *
   * @desc 后退一步
   */
  const doRevert = () => {
    if (lastOpIsRandom) {
      console.log('doRevert', '上一步操作的随机区,不允许撤回')
      return
    }
    const lastBlock = slotAreaObj.rmRightBlock(setSlotAreaVal) // 从插槽区中移除
    // 移除成功
    if (lastBlock) {
      // 将块恢复正常
      lastBlock.status = 0
      chessBoardObj.genLevelRelation(lastBlock)// 重新绑定层级关系
      updateLevelBlock(lastBlock)
    }
  }

  /**
   * 移出块
   */
  const doRemove = () => {
    // 移出第一个块
    const block = slotAreaObj.rmLeftBlock(setSlotAreaVal)
    if (block) {
      chessBoardObj.changeBlock(block)
      updateLevelBlock(block)
    }
  }

  /**
   * 圣光
   *
   * @desc 下一个块可以任意点击
   */
  const doHolyLight = () => {
    setIsHolyLight(true)
  }

  /**
   * 透视
   *
   * @desc 可以看到随机块
   */
  const doSeeRandom = () => {
    setCanSeeRandom(!canSeeRandom)
  }

  return {
    gameStatus,
    levelBlocksVal,
    randomBlocksVal,
    slotAreaVal,
    boxWidthPX,
    boxHeightPX,
    totalBlockNum,
    clearBlockNum,
    isHolyLight,
    canSeeRandom,
    doClickBlock,
    doStart,
    doShuffle,
    doBroke,
    doRemove,
    doRevert,
    doHolyLight,
    doSeeRandom,
  }
}
