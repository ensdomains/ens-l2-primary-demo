// Gets the primary name from the universal resolver

import { Address } from "viem";

import { Client, getChainContractAddress } from "viem";
import { readContract } from "viem/actions";
import { ethereum } from "../../chains2";

const ensUniversalResolverAbi = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "encodedAddress",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "coinType",
        "type": "uint256"
      }
    ],
    "name": "reverse",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
]

export const getEnsName = (client: Client, {
  address,
  chainId,
}: {
  address: Address
  chainId: number
}) => {

  return readContract(client, {
    address: getChainContractAddress({
      chain: ethereum,
      contract: "ensUniversalResolver",
    }),
    abi: ensUniversalResolverAbi,
    functionName: "reverse",
    chainId: ethereum.id,
    args: [address],
  })
}