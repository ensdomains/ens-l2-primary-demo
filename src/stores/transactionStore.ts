import { persist } from "zustand/middleware"
import { create } from "zustand"
import { Address } from "viem"
import { GetOwnerReturnType } from "@ensdomains/ensjs/public"
import { UseNameDetailsReturnType } from "../hooks/useNameDetails"
import { NameData } from "../hooks/useNameData"

type SetViewBaseParams = {
  view: "main" | "select-name" | "set-record" | "set-name"
  walletAddress?: string
  targetChainId?: number
  name?: string
  targetAddress?: Address
}

type SetViewMain = {
  view: "main"
  walletAddress?: never
  targetChainId?: never
  name?: never
}

type SetViewSelectName = {
  view: "select-name"
  walletAddress: string
  targetChainId: number
}

type SetViewParams = SetViewBaseParams & (SetViewMain | SetViewSelectName)

type SetPrimaryNameTransaction = {
  name: string
  primaryOptionid: number
  targetChainId: number
  targetAddress: Address
  canChangeName: false
}

type SetRecordTransaction = {
  name: string
  targetAddress: Address
  canChangeName: true
}

export type TransactionViewProps = {
  nameData: UseNameDetailsReturnType | null
  ownership: GetOwnerReturnType | null
  targetAddress: Address | null
  targetChainId: number | null
  primaryNameOptionId: number | null
}

type CreateTransactionFlowPayload = {
  key: string
  type: "wallet-centric" | "name-centric"
  view?: View
  nameData: NameData | null
  targetChainId?: number
  name?: string
  targetAddress?: Address
  primaryNameOptionId: number
}

type CreateTransactionFlowFn = (payload: CreateTransactionFlowPayload) => void

type View = "select-name" | "set-record" | "set-name" | 'confirm-warning'

interface TransactionStore {
  currentKey: string | null
  flows: {
    [key: string]: Array<{
      views: View[]
      viewIndex: number
    } & TransactionViewProps>
  }
  setWalletAddress: (walletAddress?: Address) => void
  setView: (params: SetViewParams) => void
  setTargetChainId: (chainId: number) => void
  setNameData: (key: string, nameData: NameData) => void
  createTransactionFlow: (payload: CreateTransactionFlowPayload) => void
  increment: () => void
  dismiss: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      flows: {},
      currentKey: null,
      setWalletAddress: (walletAddress?: Address) =>
        set((state) => {
          if (state.view !== "main") return state
          return { ...state, targetAddress: walletAddress || null }
        }),
      setView: ({ view, targetChainId, targetAddress }) =>
        set((state) => {
          if (view === "select-name")
            return { ...state, view, targetChainId, targetAddress }
          if (view === "main")
            return {
              ...state,
              view: "main",
              targetAddress: null,
              targetChainId: null,
              name: null,
            }
          return state
        }),
      setNameData: (key: string, nameData: NameData) =>
        set((state) => {
          const flow = state.flows[key]
          if (!flow) return state
          return { ...state, flows: { ...state.flows, [key]: { ...flow, nameData } } }
        }),
      setTargetChainId: (chainId: number) =>
        set((state) => {
          if (state.view !== "main") return state
          return { ...state, targetChainId: chainId }
        }),
      createTransactionFlow: ({
        key,
        type,
        view,
        ...payload
      }: CreateTransactionFlowPayload) =>
        set((state) => {
          console.log("createTransactionFlow", { key, type, view, ...payload })
          const views =
            type === "wallet-centric"
              ? ["select-name", "set-name", "set-record"]
              : ["record-name", "set-name"]
          const viewIndex = Math.max(views.findIndex((v) => v === view), 0)
          return {
            ...state,
            flows: {
              ...state.flows,
              [key]: {
                views: views,
                viewIndex,
                ...payload,
              },
            },
            currentKey: key,
          }
        }),
      increment: () => set((state) => {
        const currentKey = state.currentKey
        if (!currentKey) return state
        const flow = state.flows[currentKey]
        console.log('flow', flow)
        if (!flow) return state
        return { ...state, flows: { ...state.flows, [currentKey]: { ...flow, viewIndex: flow.viewIndex + 1 } } }
      }),
      dismiss: () =>
        set((state) => {
          return {
            ...state,
            currentKey: null,
          }
        }),
    }),
    {
      name: "transaction-store",
    },
  ),
)
