import { addEnsContracts } from "@ensdomains/ensjs"
import {
  mainnet as mainnetViem,
  sepolia as sepoliaViem,
  base as baseViem,
  baseSepolia as baseSepoliaViem,
  arbitrum as arbitrumViem,
  arbitrumSepolia as arbitrumSepoliaViem,
  optimism as optimismViem,
  optimismSepolia as optimismSepoliaViem,
  linea as lineaViem,
  lineaSepolia as lineaSepoliaViem,
  scroll as scrollViem,
  scrollSepolia as scrollSepoliaViem,
} from "viem/chains"

import { addChainModifiers } from "@/utils/chainModifiers"
import { match, P } from "ts-pattern"

const chainGroup = match({
  hostname: typeof window !== "undefined" ? window.location.hostname : "",
  isDev: import.meta.env.DEV,
})
  .with(
    {
      isDev: true,
    },
    {
      hostname: P.union(
        P.string.startsWith("sepolia"),
        P.string.includes("pages.dev"),
        P.string.startsWith("localhost"),
        P.string.startsWith("127.0.0.1"),
      ),
    },
    () => "sepolia" as const,
  )
  .with({ hostname: P.string.startsWith("primary") }, () => "mainnet" as const)
  .otherwise(() => "mainnet" as const)

const isTestnet = chainGroup === "sepolia"

export type ChainWithDetails =
  | typeof ethereum
  | typeof base
  | typeof arbitrum
  | typeof optimism
  | typeof linea
  | typeof scroll

export const ethereum = addChainModifiers(
  addEnsContracts(isTestnet ? sepoliaViem : mainnetViem),
)
export const base = addChainModifiers(isTestnet ? baseSepoliaViem : baseViem)
export const arbitrum = addChainModifiers(
  isTestnet ? arbitrumSepoliaViem : arbitrumViem,
)
export const optimism = addChainModifiers(
  isTestnet ? optimismSepoliaViem : optimismViem,
)
export const linea = addChainModifiers(isTestnet ? lineaSepoliaViem : lineaViem)
export const scroll = addChainModifiers(
  isTestnet ? scrollSepoliaViem : scrollViem,
)

export const l2Chains = [base, arbitrum, optimism, linea, scroll] as const

export const chains = [ethereum, ...l2Chains] as const
