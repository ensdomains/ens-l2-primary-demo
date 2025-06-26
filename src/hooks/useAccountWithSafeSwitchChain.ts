import { useAccount, useConfig, useSwitchChain } from "wagmi"
import { useEffect, useState } from "react"
import { Address } from "viem"
import { getChainId } from "wagmi/actions"

// When switchAccount is called with useAccount, chainID will update immediately but then will switch back if the 
// wallet does not support the chain. This can cause issues where the screen flashes or cause infinite re-renders 
// if a child component attempts to switch the chain. This hook fixes this issue by taking over controll of the 
// address and chainId return parameters by only switching the chain if the wallet successfully switches.
export const useAccountWithSafeSwitchChain = ({
  requiredAddress,
  requiredChainId,
}: {
  requiredAddress: Address
  requiredChainId: number
}) => {
  const {
    address: initialAddress,
    chainId: initialChainId,
    ...rest
  } = useAccount()

  const [addressAndChainId, setAddressAndChainId] = useState<{
    address: Address | undefined
    chainId: number | undefined
  }>({ address: initialAddress, chainId: initialChainId })

  const { switchChainAsync } = useSwitchChain()

  const config = useConfig()

  useEffect(() => {
    const unsubscribe = config.subscribe(
      (state) => {
        if (!state.current) return
        const connection = state.connections.get(state.current)
        if (!connection) return
        return connection.accounts[0]
      },
      async (newAddress: Address | undefined) => {
        if (!newAddress || !config.state.current)
          return setAddressAndChainId({
            address: undefined,
            chainId: undefined,
          })
        const connection = config.state.connections.get(config.state.current)
        if (!connection)
          return setAddressAndChainId({
            address: undefined,
            chainId: undefined,
          })
        const address = connection.accounts[0]
        const chainId = connection.chainId
        if (address === requiredAddress && chainId !== requiredChainId) {
          await switchChainAsync({ chainId: requiredChainId })
          const newChainId = await getChainId(config)
          return setAddressAndChainId({ address, chainId: newChainId })
        }
        setAddressAndChainId({ address, chainId })
      },
    )
    return unsubscribe
  }, [])

  return {
    ...addressAndChainId,
    ...rest,
  }
}
