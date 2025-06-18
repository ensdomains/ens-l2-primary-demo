import { persist } from "zustand/middleware"
import { create } from "zustand"
import { Address } from "viem"
import { NameData } from "../hooks/useNameData"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { waitForTransactionReceipt } from "wagmi/actions"
import { Config } from "wagmi"
import { match } from "ts-pattern"
import { PartialBy } from "../query/query"
import { calculateSelectAddressWithChainsTransactionFlow, type SelectAddressWithChainsView } from "@/components/views/SelectAddressWithChainsView/SelectAddressWithChainsView"
import { calculateSelectNameTransactionFlow, isValidSelectNameView, type SelectNameView } from "@/components/views/SelectNameView/SelectNameView"
import { calculateSelectNameWithChainsTransactionFlow, isValidSelectNameWithChainsView, type SelectNameWithChainsView } from "@/components/views/SelectNameWithChainsView/SelectNameWithChainsView"
import { calculateSelectAddressTransactionFlow, isValidSelectAddressView, type SelectAddressView } from "@/components/views/SelectAddressView/SelectAddressView"
import { type SetRecordsView } from "@/components/views/SetRecordsView/SetRecordsView"
import { type SyncTimeWarningView } from "@/components/views/SyncTimeWarning/SyncTimeWarning"
import { type SetPrimaryNameView } from "@/components/views/SetPrimaryNameView/SetPrimaryNameView"
import { type SetRecordView } from "@/components/views/SetRecordView/SetRecordView"
import { type DeletePrimaryNameView } from "@/components/views/DeletePrimaryNameView/DeletePrimaryNameView"
import { isValidSelectAddressWithChainsView } from '../components/views/SelectAddressWithChainsView/SelectAddressWithChainsView';

type ViewName =
  | "select-name"
  | "select-name-with-chains"
  | "select-address"
  | "select-address-with-chains"
  | "set-record"
  | "set-records"
  | "set-name"
  | "sync-time-warning"
  | "delete-primary-name"

export interface ViewBase {
  name: ViewName
  type: "input" | "transaction"
  transaction?: Transaction
  nameData?: NameData | null
  targetAddress?: string | Address | null
  primaryNameOptionId?: number
  sourceValue?: string
  coinTypes?: number[]
  subView?: string
}

export type View =
  | SelectNameView
  | SelectNameWithChainsView
  | SelectAddressView
  | SelectAddressWithChainsView
  | SetPrimaryNameView
  | SetRecordView
  | SetRecordsView
  | SyncTimeWarningView
  | DeletePrimaryNameView

export type ViewToViewProps<T extends View> = Omit<
  T,
  "name" | "type" | "primaryNameOptionId"
> & {
  primaryNameOption: PrimaryOption
}

type Transaction = {
  status: "sent" | "confirmed" | "failed"
  hash: `0x${string}`
}

type Flow = {
  views: View[]
  viewIndex: number
}

interface TransactionStore {
  currentKey: string | null
  flows: {
    [key: string]: {
      views: View[]
      viewIndex: number
    }
  }
  transactions: {
    [key: string]: Transaction
  }
  updateView: (
    viewPosition: { key: string; viewIndex: number } | null,
    payload: Partial<Omit<View, "name" | "type">>,
  ) => void
  getCurrentViewPosition: () => {
    key: string
    viewIndex: number
  } | null
  appendViews: (views: View[]) => void
  addTransaction: (
    viewPosition: { key: string; viewIndex: number },
    payload: {
      transaction: Transaction
      config: Config
    },
  ) => Promise<void>
  createTransactionFlow: (
    key: string,
    payload: PartialBy<Flow, "viewIndex">,
  ) => void
  generateTransactions: () => void
  increment: () => void
  decrement: () => void
  dismiss: () => void
  hasNext: () => boolean
  getCurrentView: () =>
    | { view: View; key: string; viewIndex: number }
    | { view: undefined; key: undefined; viewIndex: undefined }
  getCurrentFlow: () => { flow: Flow, key: string } | { flow: undefined, key: undefined }
  getCurrentTransaction: () => Transaction | null
  isFlowConfirming: (key: string) => boolean
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: {},
      flows: {},
      currentKey: null,
      addTransaction: async (
        { key, viewIndex },
        { transaction, config },
      ) => {
        set((state) => ({
          ...state,
          flows: {
            ...state.flows,
            [key]: {
              ...state.flows[key],
              views: state.flows[key].views.map((v, i) =>
                i === viewIndex ? { ...v, transaction } : v,
              ),
            },
          },
        }))
        try {
          await waitForTransactionReceipt(config, { hash: transaction.hash })
          set((state) => ({
            ...state,
            flows: {
              ...state.flows,
              [key]: {
                ...state.flows[key],
                views: state.flows[key].views.map((v, i) =>
                  i === viewIndex
                    ? {
                        ...v,
                        transaction: {
                          hash: transaction.hash,
                          status: "confirmed",
                        },
                      }
                    : v,
                ),
              },
            },
          }))
        } catch (error) {
          set((state) => ({
            ...state,
            flows: {
              ...state.flows,
              [key]: {
                ...state.flows[key],
                views: state.flows[key].views.map((v, i) =>
                  i === viewIndex
                    ? {
                        ...v,
                        transaction: {
                          hash: transaction.hash,
                          status: "failed",
                        },
                      }
                    : v,
                ),
              },
            },
          }))
        }
      },
      createTransactionFlow: (key, payload) =>{
        set((state) => {
          console.log("createTransactionFlow", { key, payload }, payload.viewIndex ?? 0)
          console.log("state", state)
          const newState = {
            ...state,
            flows: {
              ...state.flows,
              [key]: {
                ...payload,
                viewIndex: payload.viewIndex ?? 0,
              },
            },
            currentKey: key,
          }
          console.log("newState", newState)
          return newState
        })
        get().generateTransactions()
      },
      increment: () =>
        set((state) => {
          const currentKey = state.currentKey
          if (!currentKey) return state

          const flow = state.flows[currentKey]
          if (!flow) return state

          const newViewIndex = flow.viewIndex + 1
          if (newViewIndex >= flow.views.length)
            return {
              ...state,
              currentKey: null,
            }
          return {
            ...state,
            flows: {
              ...state.flows,
              [currentKey]: { ...flow, viewIndex: newViewIndex },
            },
          }
        }),
      decrement: () =>
        set((state) => {
          const currentKey = state.currentKey
          if (!currentKey) return state
          const flow = state.flows[currentKey]
          if (!flow) return state
         
          console.log("decrement", { currentKey, flow })
          const newViewIndex = flow.viewIndex - 1
          if (newViewIndex < 0)
            return {
              ...state,
              currentKey: null,
            }
          return {
            ...state,
            flows: {
              ...state.flows,
              [currentKey]: { ...flow, viewIndex: flow.viewIndex - 1 },
            },
          }
        }),
      dismiss: () =>
        set((state) => {
          return {
            ...state,
            currentKey: null,
          }
        }),
      updateView: (viewPosition, payload) =>
        set((state) => {
          if (!viewPosition) return state

          const { key, viewIndex } = viewPosition
          const flow = state.flows[key]
          if (!flow) return state

          const view = flow.views[viewIndex]
          if (!view) return state

          const newView = { ...view, ...payload } as View
          return {
            ...state,
            flows: {
              ...state.flows,
              [key]: {
                ...flow,
                views: flow.views.map((v, i) =>
                  i === viewIndex ? newView : v,
                ),
              },
            },
          }
        }),
      hasNext: () => {
        const { flow } = get().getCurrentFlow()
        if (!flow) return false
        return flow.viewIndex < flow.views.length - 1
      },
      getCurrentFlow: () => {
        const flows = get().flows
        const failedResult = { flow: undefined, key: undefined }

        const currentKey = get().currentKey
        if (!currentKey) return failedResult

        const flow = flows[currentKey]
        if (!flow) return failedResult

        return { flow, key: currentKey }
      },
      getCurrentView: () => {
        const { flow, key } = get().getCurrentFlow()
        const failedResult = { view: undefined, key: undefined, viewIndex: undefined }

        if (!flow) return failedResult

        const viewIndex = flow.viewIndex
        const view = flow?.views[viewIndex]
        if (!view) return failedResult

        return { view, key, viewIndex }
      },
      appendViews: (views: View[]) =>
        set((state) => {
          const currentKey = get().currentKey
          if (!currentKey) return state

          const flow = get().flows[currentKey]
          if (!flow) return state
 
          const currentSlice = flow.views.slice(0, flow.viewIndex + 1)
          return {
            ...state,
            flows: {
              ...state.flows,
              [currentKey]: {
                ...flow,
                views: [...currentSlice, ...views],
              },
            },
          }
        }),
      getCurrentViewPosition: () => {
        const currentKey = get().currentKey
        if (!currentKey) return null
        const flow = get().flows[currentKey]
        if (!flow) return null
        return { key: currentKey, viewIndex: flow.viewIndex }
      },
      generateTransactions: () => {

        const { view } = get().getCurrentView()
        if (!view) return

        const transactions = match(view)
        .with(isValidSelectAddressView, calculateSelectAddressTransactionFlow)
        .with(isValidSelectAddressWithChainsView, calculateSelectAddressWithChainsTransactionFlow)
        .with(isValidSelectNameView, calculateSelectNameTransactionFlow)
        .with(isValidSelectNameWithChainsView, calculateSelectNameWithChainsTransactionFlow)
        .otherwise(() => [])

        get().appendViews(transactions)
      },
      getCurrentTransaction: () => {
        const { view } = get().getCurrentView()
        if (!view) return null
        return view.transaction ?? null
      },
      isFlowConfirming: (key: string) => {
        const flow = get().flows[key]
        if (!flow) return false
        return flow.views.some((v) => v.transaction?.status === "sent")
      },
    }),
    {
      name: "transaction-store",
    },
  ),
)
