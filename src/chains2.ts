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
  Chain,
} from "viem/chains"

import arbitrumIcon from "./assets/chain-icon/arbitrum.svg";
import baseIcon from "./assets/chain-icon/base.svg";
import ethereumIcon from "./assets/chain-icon/ethereum.svg";
import lineaIcon from "./assets/chain-icon/linea.svg";
import optimismIcon from "./assets/chain-icon/optimism.svg";
import scrollIcon from "./assets/chain-icon/scroll.svg";
import { addPrimaryNameContractsAndCoinType } from "./addPrimaryNameContracts";

const isTestnet = true

export const ethereum = { ...addPrimaryNameContractsAndCoinType(addEnsContracts(isTestnet ? sepoliaViem : mainnetViem)), 
  icon: ethereumIcon,
  syncTime: '1 block',
}
export const base = { ...addPrimaryNameContractsAndCoinType(isTestnet ? baseSepoliaViem : baseViem),
  icon: baseIcon,
  syncTime: '6 hr',
}

export const arbitrum = { ...addPrimaryNameContractsAndCoinType(isTestnet ? arbitrumSepoliaViem : arbitrumViem),
  icon: arbitrumIcon,
  syncTime: '6 hr',
}
export const optimism = { ...addPrimaryNameContractsAndCoinType(isTestnet ? optimismSepoliaViem : optimismViem),
  icon: optimismIcon,
  syncTime: '6 hr',
}
export const linea = { ...addPrimaryNameContractsAndCoinType(isTestnet ? lineaSepoliaViem : lineaViem),
  icon: lineaIcon,
  syncTime: '8 - 24hr',
}

export const scroll = { ...addPrimaryNameContractsAndCoinType(isTestnet ? scrollSepoliaViem : scrollViem),
  icon: scrollIcon,
  syncTime: '1 hr',
}

export const l2Chains = [
  base,
  arbitrum,
  optimism,
  linea,
  scroll,
] as const satisfies Chain[]

export const chains = [
  ethereum,
  ...l2Chains,
] as const satisfies Chain[]
