import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultGameConfig } from '@/core/gameConfig.ts'
import type { GameConfigType } from '@/core/types.ts'

export const useGlobalStore = create(persist(
  setState => ({
    customConfig: { ...defaultGameConfig },
    gameConfig: { ...defaultGameConfig },
    // actions
    setGameConfig: (gameConfig: GameConfigType) => {
      setState({ gameConfig })
    },
    setCustomConfig: (customConfig: GameConfigType) => {
      setState({ customConfig })
    },
  }),
  {
    name: 'global-store',
  },
))
