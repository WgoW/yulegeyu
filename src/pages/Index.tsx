import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import {
  easyGameConfig,
  hardGameConfig,
  lunaticGameConfig,
  middleGameConfig,
  skyGameConfig,
  yangGameConfig,
} from '@/core/gameConfig.ts'
import type { GameConfigType } from '@/core/types.ts'
import { GameMode } from '@/core/types.ts'
import { gameConfigAtom, useGlobalDevtools } from '@/core/globalStore'

function Index() {
  const navigate = useNavigate()
  const [_, setGameConfig] = useAtom(gameConfigAtom)
  useGlobalDevtools()

  const toGame = (config?: GameConfigType) => {
    if (config) {
      setGameConfig(config)
      navigate('/game', { state: config })
    }
    else {
      navigate('/config')
    }
  }

  const models: { [key in GameMode]?: GameConfigType | undefined } = {
    [GameMode.EASY]: easyGameConfig,
    [GameMode.MIDDLE]: middleGameConfig,
    [GameMode.HARD]: hardGameConfig,
    [GameMode.LUNATIC]: lunaticGameConfig,
    [GameMode.SKY]: skyGameConfig,
    [GameMode.YANG]: yangGameConfig,
    [GameMode.CUSTOM]: undefined,
  }

  return (
    <div className="text-center flex-auto">
      <h1 className="text-3xl mb-5">🐟 鱼了个鱼</h1>
      <div className="mb-10">低配版羊了个羊小游戏，仅供消遣</div>
      {
        Object.keys(models).map(key => (
          <Button
            key={key}
            block
            className="mb-5"
            onClick={() => toGame(models[key as GameMode])}
          >
            {key}
          </Button>
        ))
      }
    </div>
  )
}

export default Index
