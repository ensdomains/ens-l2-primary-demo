import { evmChainIdToCoinType } from "@ensdomains/address-encoder/utils";
import { Chain } from "viem";
import { 
  mainnet,
  sepolia,
 } from "viem/chains";

 const ethereumChainIds: number[] = [mainnet.id, sepolia.id]


export type ChainWithCoinType<T extends Chain> = T & {
  coinType: number
}

export const addCoinTypes = <T extends Chain>(chain: T): ChainWithCoinType<T> => {
  const isEthereumChain = ethereumChainIds.includes(chain.id)
  return {
    ...chain,
    // This is neccessary since our reverse contracts treat l1 testnets as mainnet clones
    coinType: isEthereumChain ? 60 : evmChainIdToCoinType(chain.id),
  };
};
