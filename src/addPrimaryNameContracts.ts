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
    ensDefaultReverseRegistrar: "0x089C3F89e6eE8bAc40aFA96267a1c84003109d1b",
    // ensUniversalResolver: "0xC087fF4e7D743c3ae6673FF5d42391b741369169",
    ensUniversalResolver: "0xB95CD2A59111d08BBeD6863218fa21009142d02b",
  },
  [optimism.id]: {},
  [optimismSepolia.id]: {
    l1ReverseResolver: "0xD8af9130D2A770B53A20EEbC40377D097f3EFc19",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [arbitrum.id]: {},
  [arbitrumSepolia.id]: {
    l1ReverseResolver: "0x5Fec74B711EdE9828eddfb7A0370BD28D075fdeF",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [base.id]: {},
  [baseSepolia.id]: {
    l1ReverseResolver: "0x490F21cA7294Db7489b98A251D029E83a17A7262",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [linea.id]: {},
  [lineaSepolia.id]: {
    l1ReverseResolver: "0x65Fd0B7576027fDF1EE49dA5099D9bCb305710e5",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
  [scroll.id]: {},
  [scrollSepolia.id]: {
    l1ReverseResolver: "0xDf756B18878da8229e4e741A467b4432dde0601A",
    l2ReverseRegistrar: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
  },
} as const

export const addPrimaryNameContractsAndCoinType = (chain: Chain) => {
  const contractsAddresses = contractAddresses[chain.id] || {}
  const contracts = Object.fromEntries(Object.entries(contractsAddresses).map(([key, value]) => [key, { address: value }]))
  return {
    ...chain,
    // This is neccessary since our reverse contracts treat l1 testnets as mainnet clones
    coinType: chain.id === sepolia.id ? 60 : evmChainIdToCoinType(chain.id),
    contracts: {
      ...chain.contracts,
     ...contracts
    },
  };
};
