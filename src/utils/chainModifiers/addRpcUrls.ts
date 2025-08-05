import { Chain } from "viem";
import { 
  mainnet,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  linea,
  lineaSepolia,
  scroll,
  scrollSepolia,
 } from "viem/chains";

const drpcUrl = (chainName: string) => `https://lb.drpc.org/ogrpc?network=${chainName}&dkey=${import.meta.env.VITE_DRPC_KEY}`

const rpcDict: Record<number, string[]> = {
  [mainnet.id]: [drpcUrl('ethereum')],
  [sepolia.id]: [drpcUrl('sepolia'), 'https://sepolia.drpc.org'],
  [optimism.id]: [drpcUrl('optimism')],
  [optimismSepolia.id]: [drpcUrl('optimism-sepolia'), 'https://sepolia.optimism.io'],
  [arbitrum.id]: [drpcUrl('arbitrum')],
  [arbitrumSepolia.id]: [drpcUrl('arbitrum-sepolia'), 'https://sepolia-rollup.arbitrum.io/rpc'],
  [base.id]: [drpcUrl('base')],
  [baseSepolia.id]: [drpcUrl('base-sepolia'), 'https://sepolia.base.org'],
  [linea.id]: [drpcUrl('linea')],
  [lineaSepolia.id]: [drpcUrl('linea-sepolia'), 'https://rpc.sepolia.linea.build'],
  [scroll.id]: [drpcUrl('scroll')],
  [scrollSepolia.id]: [drpcUrl('scroll-sepolia'), 'https://sepolia-rpc.scroll.io'],
}

export type ChainWithRpcUrls<T extends Chain> = T & {
  rpcs: string[]
}

export const addRpcUrls = <T extends Chain>(chain: T): ChainWithRpcUrls<T> => {
  const rpcs = rpcDict[chain.id] || []
  return {
    ...chain,
    rpcs,
  };
};
