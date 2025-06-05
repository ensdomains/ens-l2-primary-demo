import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { Address } from 'viem';

type View = 'main' | 'set-record' | 'set-name'

type SetViewBaseParams = {
  view: 'main' | 'select-name' | 'set-record' | 'set-name'
  walletAddress?: string
  targetChainId?: number
  name?: string
  targetAddress?: Address
}

type SetViewMain = {
  view: 'main'
  walletAddress?: never
  targetChainId?: never
  name?: never
}

type SetViewSelectName = {
  view: 'select-name'
  walletAddress: string
  targetChainId: number
}

type SetViewParams = SetViewBaseParams & (SetViewMain | SetViewSelectName)

interface TransactionStore {
  view: View
  name: string | null
  targetAddress: Address | null
  targetChainId: number | null
  setWalletAddress: (walletAddress?: Address) => void
  setView: (params: SetViewParams) => void
  setTargetChainId: (chainId: number) => void
  setName: (name: string) => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      view: 'main',
      name: null,
      targetAddress: null,
      targetChainId: null,
      setWalletAddress: (walletAddress?: Address) => set((state) => {
        if (state.view !== "main") return state
        return ({ ...state, targetAddress: walletAddress || null })}),
      setView: ({ view, targetChainId, targetAddress }) => set((state) => {
        if (view === 'select-name') return { ...state, view, targetChainId, targetAddress}
        if (view === 'main') return {
          ...state,
          view: 'main',
          targetAddress: null,
          targetChainId: null,
          name: null,
        }
        return state
      }),
      setName: (name: string) => set((state) => {
        if (state.view !== 'set-name') return state
        return ({ ...state, name })
      }),
      setTargetChainId: (chainId: number) => set((state) => {
        if (state.view !== 'main') return state
        return ({ ...state, targetChainId: chainId })
      }),
    }),
    {
      name: 'transaction-store',
    }
  )
)
