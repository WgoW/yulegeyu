import { atomWithStorage } from 'jotai/utils'
import { useAtomDevtools } from 'jotai-devtools'
import { useAtom } from 'jotai/index'
import { defaultGameConfig } from '@/core/gameConfig.ts'

export const customConfigAtom = atomWithStorage(
  'global-custom-config',
  { ...defaultGameConfig },
)
export const gameConfigAtom = atomWithStorage(
  'global-game-config',
  { ...defaultGameConfig },
)

export function useGlobalConfig() {
  const [customConfig, setCustomConfig] = useAtom(customConfigAtom)
  const [gameConfig, setGameConfig] = useAtom(gameConfigAtom)

  const resetConfig = () => {
    setCustomConfig({ ...defaultGameConfig })
    setGameConfig({ ...defaultGameConfig })
  }
  return {
    customConfig,
    setCustomConfig,
    gameConfig,
    setGameConfig,
    resetConfig,
  }
}

export function useGlobalDevtools() {
  // 1. Redux DevTools
  useAtomDevtools(customConfigAtom, { name: 'customConfigAtom' })
  useAtomDevtools(gameConfigAtom, { name: 'gameConfigAtom' })
  // 2. React Dev Tools
  customConfigAtom.debugLabel = 'customConfigAtom'
  gameConfigAtom.debugLabel = 'gameConfigAtom'
}
