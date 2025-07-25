import { Address, Chain, ChainContract } from "viem";
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

const contractAddressDictionary: Record<number, Record<string, Address>> = {
  [mainnet.id]: {
    ensDefaultReverseRegistrar: "0x283F227c4Bd38ecE252C4Ae7ECE650B0e913f1f9",
    ensReverseRegistrar: "0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb",
    ensUniversalResolver:"0xaBd80E8a13596fEeA40Fd26fD6a24c3fe76F05fB",
  },
  [sepolia.id]: {
    ensDefaultReverseRegistrar: "0x4F382928805ba0e23B30cFB75fC9E848e82DFD47",
    ensReverseRegistrar: "0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6",
    ensUniversalResolver:"0xb7B7DAdF4D42a08B3eC1d3A1079959Dfbc8CFfCC",
  },
  [optimism.id]: {
    l1ReverseResolver: "0xF9Edb1A21867aC11b023CE34Abad916D29aBF107",
    l2ReverseRegistrar: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
  },
  [optimismSepolia.id]: {
    l1ReverseResolver: "0xc9Ae189772BD48e01410AB3Be933637ee9D3AA5f",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [arbitrum.id]: {
    l1ReverseResolver: "0x4b9572C03AAa8b0Efa4B4b0F0cc0f0992bEDB898",
    l2ReverseRegistrar: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
  },
  [arbitrumSepolia.id]: {
    l1ReverseResolver: "0x926f94D2aDC77C86Cb0050892097D49AADd02e8B",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [base.id]: {
    l1ReverseResolver: "0xc800DBc8ff9796E58EfBa2d7b35028DdD1997E5e",
    l2ReverseRegistrar: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
  },
  [baseSepolia.id]: {
    l1ReverseResolver: "0xaF3b3f636bE80b6709F5Bd3A374d6ac0D0a7c7aA",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [linea.id]: {
    l1ReverseResolver: "0x0Ce08a41bdb10420FB5Cac7Da8CA508EA313aeF8",
    l2ReverseRegistrar: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
  },
  [lineaSepolia.id]: {
    l1ReverseResolver: "0x083dA1Dbc0F379ccda6AC81A934207c3D8a8a205",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [scroll.id]: {
    l1ReverseResolver: "0xC4842814cA523E481Ca5aa85F719FEd1E9CaC614",
    l2ReverseRegistrar: "0x0000000000D8e504002cC26E3Ec46D81971C1664",
  },
  [scrollSepolia.id]: {
    l1ReverseResolver: "0x9Fa59673e43F15bDB8722Fdaf5C2107574B99062",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
} as const

export type ChainWithContracts<T extends Chain> = T & {
  contracts: {
    l1ReverseResolver?: ChainContract
    l2ReverseRegistrar?: ChainContract
  }
}

export const addContracts = <T extends Chain>(chain: T): ChainWithContracts<T> => {
  const contractAddressRecords = contractAddressDictionary[chain.id] || {}
  const contracts = Object.fromEntries(Object.entries(contractAddressRecords).map(([key, value]) => [key, { address: value }])) satisfies {[key: string]: ChainContract}
  return {
    ...chain,
    contracts: {
      ...chain.contracts,
     ...contracts
    },
  };
};
