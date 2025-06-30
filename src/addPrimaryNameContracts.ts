import { evmChainIdToCoinType } from "@ensdomains/address-encoder/utils";
import { Address, Chain } from "viem";
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

const contractAddresses: Record<number, Record<string, Address>> = {
  [mainnet.id]: {},
  [sepolia.id]: {
    ensDefaultReverseRegistrar: "0x4F382928805ba0e23B30cFB75fC9E848e82DFD47",
    ensReverseRegistrar: "0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6",
    ensUniversalResolver:"0xb7B7DAdF4D42a08B3eC1d3A1079959Dfbc8CFfCC",
  },
  [optimism.id]: {},
  [optimismSepolia.id]: {
    l1ReverseResolver: "0xc9Ae189772BD48e01410AB3Be933637ee9D3AA5f",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [arbitrum.id]: {},
  [arbitrumSepolia.id]: {
    l1ReverseResolver: "0x926f94D2aDC77C86Cb0050892097D49AADd02e8B",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [base.id]: {},
  [baseSepolia.id]: {
    l1ReverseResolver: "0xaF3b3f636bE80b6709F5Bd3A374d6ac0D0a7c7aA",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [linea.id]: {},
  [lineaSepolia.id]: {
    l1ReverseResolver: "0x083dA1Dbc0F379ccda6AC81A934207c3D8a8a205",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [scroll.id]: {},
  [scrollSepolia.id]: {
    l1ReverseResolver: "0x9Fa59673e43F15bDB8722Fdaf5C2107574B99062",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
} as const

const apiKeys = {
  drpc: "AnmpasF2C0JBqeAEzxVO8aTteiMlrW4R75hpDonbV6cR",
}

const drpcUrl = (chainName: string) => `https://lb.drpc.org/ogrpc?network=${chainName}&dkey=${apiKeys.drpc}`

const rpcDict: Record<number, string[]> = {
  [mainnet.id]: [drpcUrl('mainnet')],
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

export type ChainWithChainData = Chain & {
  coinType: number
  rpcs: string[]
}

export const addPrimaryNameContractsAndChainData = (chain: Chain): ChainWithChainData => {
  const contractsAddresses = contractAddresses[chain.id] || {}
  const contracts = Object.fromEntries(Object.entries(contractsAddresses).map(([key, value]) => [key, { address: value }]))
  const rpcs = rpcDict[chain.id] || []
  return {
    ...chain,
    // This is neccessary since our reverse contracts treat l1 testnets as mainnet clones
    coinType: chain.id === sepolia.id ? 60 : evmChainIdToCoinType(chain.id),
    contracts: {
      ...chain.contracts,
     ...contracts
    },
    rpcs,
  };
};
