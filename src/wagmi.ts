import { getDefaultConfig } from "@rainbow-me/rainbowkit"

import { chains } from "./constants/chains"
import { fallback, http } from "viem"

export const config_ = getDefaultConfig({
  appName: "ENS L2 Primary Demo",
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains,
  transports: chains.reduce((transports, chain) => {
    return {
      ...transports,
      [chain.id]: fallback(chain.rpcs.map((rpc) => http(rpc))),
    }
  }, {}),
})

export type SupportedChain = (typeof config_.chains)[number]
export type L1Chain = Extract<SupportedChain, { sourceId: undefined }>

export const wagmiConfig = config_ as typeof config_ & {
  _isEns: true
}

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig
  }
}
