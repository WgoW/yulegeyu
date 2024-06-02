import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Space } from 'antd'
import { useGame } from '@/core/game.ts'
import MyAd from '@/components/MyAd.tsx'
import '@/pages/Game.css'
import { GameStatus } from '@/core/types.ts'

const Game: React.FC = () => {
  console.log('Game', 'render')
  const navigate = useNavigate()
  const {
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
  } = useGame()

  /**
   * 回上一页
   */
  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    doStart()
  }, [])

  return (
    <>
      <div className="flex justify-between">
        <Button onClick={goBack}>
          返回
        </Button>
        <Button>
          块数：
          {clearBlockNum}
          /
          {totalBlockNum}
        </Button>
      </div>
      {/* 胜利 */}
      <div>
        {gameStatus === 3 && (
          <div className="text-center">
            <h2>恭喜，你赢啦！🎉</h2>
            <img alt="程序员鱼皮" src="@/assets/kunkun.png" />
            <MyAd customStyle={{ marginTop: '16px' }} />
          </div>
        )}
      </div>
      {/* 分层选块 */}
      <div>
        <div
          className="level-board"
          style={{
            visibility: gameStatus === GameStatus.PLAYING ? 'visible' : 'hidden',
          }}
        >
          {
                levelBlocksVal.map((block, index) => (
                  <div key={index}>
                    {block.status === 0 && (
                      <div
                        className={isHolyLight || block.upBlocks.length === 0 ? 'block level-block' : 'block level-block disabled'}
                        style={{
                          zIndex: 100 + block.level,
                          left: `${block.x * boxWidthPX}px`,
                          top: `${block.y * boxHeightPX}px`,
                        }}
                        onClick={() => doClickBlock(block)}
                      >
                        {block.type}
                      </div>
                    )}
                  </div>
                ))
              }
        </div>
      </div>
      {/* 随机选块 */}
      <div className="random-board justify-between space-x-4">
        {
          randomBlocksVal.map((randomBlock, index) => (
            <div key={index} className="random-area inline-flex">
              {/* 第一张明牌 */}
              {randomBlock.length > 0 && (
                <div
                  className="block"
                  onClick={() => doClickBlock(randomBlock[0], index)}
                >
                  {randomBlock[0]?.type}
                </div>
              )}
              {/*  隐藏牌 */}
              {randomBlock.slice(1).map((block, index) => (
                <div key={index} className="block disabled">
                  {canSeeRandom && <span>{block.type}</span>}
                </div>
              ))}
            </div>
          ))
        }
      </div>
      {/* 槽位 */}
      {slotAreaVal.length > 0 && (
        <div className="slot-board inline-flex">
          {slotAreaVal.map((slotBlock, index) => (
            <div key={index} className="block">
              {slotBlock?.type}
            </div>
          ))}
        </div>
      )}
      {/* 技能 */}
      <div className="skill-board">
        <Space>
          <Button size="small" onClick={doRevert}>撤回</Button>
          <Button size="small" onClick={doRemove}>移出</Button>
          <Button size="small" onClick={doShuffle}>洗牌</Button>
          <Button size="small" onClick={doBroke}>破坏</Button>
          <Button size="small" onClick={doHolyLight}>圣光</Button>
          <Button size="small" onClick={doSeeRandom}>透视</Button>
        </Space>
      </div>
    </>
  )
}
export default Game
