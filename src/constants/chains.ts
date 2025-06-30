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

import arbitrumIcon from "@/assets/chain-icon/arbitrum.svg";
import baseIcon from "@/assets/chain-icon/base.svg";
import ethereumIcon from "@/assets/chain-icon/ethereum.svg";
import lineaIcon from "@/assets/chain-icon/linea.svg";
import optimismIcon from "@/assets/chain-icon/optimism.svg";
import scrollIcon from "@/assets/chain-icon/scroll.svg";
import { addPrimaryNameContractsAndChainData, ChainWithChainData } from "@/addPrimaryNameContracts";

const isTestnet = import.meta.env.DEV || import.meta.env.VITE_ENV === 'dev'

export type ChainWithMetaData = ChainWithChainData & {
  icon: string
  syncTime: string
  chainType: 'l1' | 'l2'
}

export const ethereum: ChainWithMetaData = { ...addPrimaryNameContractsAndChainData(addEnsContracts(isTestnet ? sepoliaViem : mainnetViem)), 
  icon: ethereumIcon,
  syncTime: '1 block',
  chainType: 'l1'
}
export const base: ChainWithMetaData = { ...addPrimaryNameContractsAndChainData(isTestnet ? baseSepoliaViem : baseViem),
  icon: baseIcon,
  syncTime: '6 hr',
  chainType: 'l2'
}

export const arbitrum: ChainWithMetaData = { ...addPrimaryNameContractsAndChainData(isTestnet ? arbitrumSepoliaViem : arbitrumViem),
  icon: arbitrumIcon,
  syncTime: '6 hr',
  chainType: 'l2'
}
export const optimism: ChainWithMetaData = { ...addPrimaryNameContractsAndChainData(isTestnet ? optimismSepoliaViem : optimismViem),
  icon: optimismIcon,
  syncTime: '6 hr',
  chainType: 'l2'
}
export const linea: ChainWithMetaData = { ...addPrimaryNameContractsAndChainData(isTestnet ? lineaSepoliaViem : lineaViem),
  icon: lineaIcon,
  syncTime: '8 - 24hr',
  chainType: 'l2'
}

export const scroll: ChainWithMetaData = { ...addPrimaryNameContractsAndChainData(isTestnet ? scrollSepoliaViem : scrollViem),
  icon: scrollIcon,
  syncTime: '1 hr',
  chainType: 'l2'
}

export const l2Chains = [
  base,
  arbitrum,
  optimism,
  linea,
  scroll,
] as const

export const chains = [
  ethereum,
  ...l2Chains,
] as const
