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

const getChainGroup = () => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : ""
  const isDev = import.meta.env?.DEV ?? false
  
  return match({ hostname, isDev })
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
}

const chainGroup = getChainGroup()
const isTestnet = chainGroup === "sepolia"

// Create properly typed chain configurations
const ethereumChain = isTestnet ? sepoliaViem : mainnetViem
const baseChain = isTestnet ? baseSepoliaViem : baseViem
const arbitrumChain = isTestnet ? arbitrumSepoliaViem : arbitrumViem
const optimismChain = isTestnet ? optimismSepoliaViem : optimismViem
const lineaChain = isTestnet ? lineaSepoliaViem : lineaViem
const scrollChain = isTestnet ? scrollSepoliaViem : scrollViem

export const ethereum = addChainModifiers(addEnsContracts(ethereumChain))
export const base = addChainModifiers(baseChain)
export const arbitrum = addChainModifiers(arbitrumChain)
export const optimism = addChainModifiers(optimismChain)
export const linea = addChainModifiers(lineaChain)
export const scroll = addChainModifiers(scrollChain)

export type ChainWithDetails =
  | typeof ethereum
  | typeof base
  | typeof arbitrum
  | typeof optimism
  | typeof linea
  | typeof scroll

export const l2Chains = [base, arbitrum, optimism, linea, scroll] as const

export const chains = [ethereum, ...l2Chains] as const
