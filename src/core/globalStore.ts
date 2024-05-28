import { atomWithStorage } from 'jotai/utils'
import { useAtomDevtools } from 'jotai-devtools'
import { defaultGameConfig } from '@/core/gameConfig.ts'

export const customConfigAtom = atomWithStorage(
  'global-custom-config',
  { ...defaultGameConfig },
)
export const gameConfigAtom = atomWithStorage(
  'global-game-config',
  { ...defaultGameConfig },
)

export function useGlobalDevtools() {
  // 1. Redux DevTools
  useAtomDevtools(customConfigAtom, { name: 'customConfigAtom' })
  useAtomDevtools(gameConfigAtom, { name: 'gameConfigAtom' })
  // 2. React Dev Tools
  customConfigAtom.debugLabel = 'customConfigAtom'
  gameConfigAtom.debugLabel = 'gameConfigAtom'
}
