import { Address } from "viem";
import { useAccountWithSafeSwitchChain } from "./useAccountWithSafeSwitchChain";

export const useCheckAddressAndChain = ({
  address: requiredAddress,
  chainId: requiredChainId
}: {
  address: Address
  chainId: number
}) => {

  const { address,  chainId } = useAccountWithSafeSwitchChain({ requiredAddress, requiredChainId })

  return {
    isAddressAndChainValid: address === requiredAddress && chainId === requiredChainId,
    isAddressValid: address === requiredAddress,
    isChainValid: chainId === requiredChainId,
  }
}
