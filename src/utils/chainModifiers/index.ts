import { Chain } from "viem";
import { addCoinTypes, ChainWithCoinType } from "./addCoinTypes";
import { addRpcUrls, ChainWithRpcUrls } from "./addRpcUrls";
import { addContracts, ChainWithContracts } from "./addContracts";
import { addMetaData, ChainWithMetaData } from "./addMetaData";

export const addChainModifiers = <T extends Chain>(chain: T): ChainWithCoinType<T> & ChainWithRpcUrls<T> & ChainWithContracts<T> & ChainWithMetaData<T> => {
  return addMetaData(addCoinTypes(addRpcUrls(addContracts(chain))))
}