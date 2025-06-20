import { useEffect, useState } from "react"
import { useAccount, useConfig, useSwitchChain } from "wagmi"

// The purpose of this hook is to avoid any flickering that may be caused by switchChain since this
// action may work quickly (< 1s) if it is successful. Thus we introduce a new variable hasSwitchedChain 
// which we will use to keep the ChangeAddressView visible until the switchChain action is complete.

export const useAccountWithChainSwitch = ({
  requiredAddress,
  requiredChainId,
}: {
  requiredAddress: string
  requiredChainId: number
}) => {
  const { address, chainId, connector, ...rest } = useAccount()
  const { switchChain } = useSwitchChain()
  const config = useConfig()

  const [hasSwitchedChain, setHasSwitchedChain] = useState(false)
  
  // Run once on mount to since callback below is only fired on change
  useEffect(() => {
    if (!!address && address === requiredAddress && chainId !== requiredChainId) {
      switchChain({ chainId: requiredChainId })
      setHasSwitchedChain(true)
    }
  }, [])
  
  // Ensure that this action only runs once each time a new account is connected. This is because 
  // switchChain inside a useEffect callback had a tendency to cause the hook to execute multiple times 
  // causing a flicker in the UI.
  useEffect(() => {
    const unsubscribe = config.subscribe(
      (state) => state.current ? state.connections.get(state.current)?.accounts[0] : null,
      async (newAddress) => {
        setHasSwitchedChain(false)
        if (newAddress === requiredAddress && chainId !== requiredChainId) {
          await switchChain({ chainId: requiredChainId })
          setHasSwitchedChain(true)
        }
      },
    )
    return () => unsubscribe() 
  }, [])

  return { address, chainId, connector,hasSwitchedChain, ...rest }
}
