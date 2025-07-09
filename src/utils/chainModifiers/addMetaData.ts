import { match, P } from "ts-pattern"
import { Chain } from "viem"
import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, optimismSepolia, optimism, sepolia, lineaSepolia, linea, scrollSepolia, scroll } from "viem/chains"
import arbitrumIcon from "@/assets/chain-icon/arbitrum.svg";
import baseIcon from "@/assets/chain-icon/base.svg";
import ethereumIcon from "@/assets/chain-icon/ethereum.svg";
import lineaIcon from "@/assets/chain-icon/linea.svg";
import optimismIcon from "@/assets/chain-icon/optimism.svg";
import scrollIcon from "@/assets/chain-icon/scroll.svg";

type MetaData = {
  icon: string
  syncTime: string
  chainType: 'l1' | 'l2'
}

export type ChainWithMetaData<T extends Chain> = T & MetaData

const getMetaData = (chainId: number) => {
  return match(chainId)
  .with(P.union(mainnet.id, sepolia.id), () => ({
    icon: ethereumIcon,
    syncTime: '1 block',
    chainType: 'l1',
  } satisfies MetaData))
  .with(P.union(base.id, baseSepolia.id), () => ({
    icon: baseIcon,
    syncTime: '6 hr',
    chainType: 'l2',
  } satisfies MetaData))
  .with(P.union(arbitrum.id, arbitrumSepolia.id), () => ({
    icon: arbitrumIcon,
    syncTime: '6 hr',
    chainType: 'l2',
  } satisfies MetaData))
  .with(P.union(optimism.id, optimismSepolia.id), () => ({
    icon: optimismIcon,
    syncTime: '6 hr',
    chainType: 'l2',
  } satisfies MetaData))
  .with(P.union(linea.id, lineaSepolia.id), () => ({
    icon: lineaIcon,
    syncTime: '8 - 24hr',
    chainType: 'l2',
  } satisfies MetaData))
  .with(P.union(scroll.id, scrollSepolia.id), () => ({
    icon: scrollIcon,
    syncTime: '1 hr',
    chainType: 'l2',
  } satisfies MetaData))
  .otherwise(() => ({
    icon: '',
    syncTime: '',
    chainType: 'l2',
  } satisfies MetaData))
}

export const addMetaData = <T extends Chain>(chain: T): ChainWithMetaData<T> => {
  const metaData = getMetaData(chain.id)
  return {
    ...chain,
    ...metaData,
  }
}