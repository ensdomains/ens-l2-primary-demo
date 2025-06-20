import { useAccount } from "wagmi"
import { Address } from "viem";

export const useCheckAddressAndChain = ({
  address: requiredAddress,
  chainId: requiredChainId
}: {
  address: Address
  chainId: number
}) => {

  const { address,  chainId: currentChainId } = useAccount()

  return address === requiredAddress && currentChainId === requiredChainId
}
