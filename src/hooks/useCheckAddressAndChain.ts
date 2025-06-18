import { useEffect, useState } from "react"
import { useAccount, useSwitchChain } from "wagmi"
import { Address } from "viem";
import { disconnect } from "wagmi/actions"
import { useConfig } from "wagmi"
import { tryPredicate } from "@/utils/tryPredicate";

export const useCheckAddressAndChain = ({
  address: requiredAddress,
  chainId: requiredChainId
}: {
  address: Address
  chainId: number
}) => {

  const [result, setResult] = useState<{
    data: boolean | undefined
    isLoading: boolean
  }>({ data: undefined, isLoading: true })

  const { address, connector, chainId: currentChainId, isConnecting, isConnected } = useAccount()
  const config = useConfig()
  const { switchChain } = useSwitchChain()

  console.log("useCheckAddressAndChain", { address, requiredAddress, currentChainId, requiredChainId, isConnecting, isConnected })

  useEffect(() => {
    const check = async () => {
      console.log("checking >>>>>", {address, requiredAddress, currentChainId, requiredChainId})
      try {
        setResult({ data: undefined, isLoading: true })
        if (address !== requiredAddress) {
          await disconnect(config)
          setResult({ data: false, isLoading: false })
          return
        }
        
        // Attempt to switch to right chain
        if (currentChainId !== requiredChainId) await switchChain({ chainId: requiredChainId })
        const isChainInSync = await tryPredicate(async () => {
          return await connector?.getChainId() === requiredChainId
        }, {delay: 1000})
        
        if (!isChainInSync) {
          console.log('isChainInSync', isChainInSync, { isConnecting, isConnected})
          alert("chain is not in sync")
          await disconnect(config)
          setResult({ data: false, isLoading: false })
          return
        }

        setResult({ data: true, isLoading: false })
      } catch {
        await disconnect(config)
        setResult({ data: false, isLoading: false })
      }
    }
    check()
  }, [address, connector, requiredAddress, requiredChainId, switchChain])

  console.log("useCheckAddressAndChain result", result)
  return result
}
