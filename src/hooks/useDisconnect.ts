import { useConfig } from "wagmi"
import { disconnect as disconnectWagmi } from "wagmi/actions"
import { useDisconnect as useDisconnectWagmi } from "wagmi"

const LOCAL_STORAGE_KEYS = ['rk-latest-id', 'wagmi.recentConnectorId', 'wagmi.store']

export const useDisconnect = () => {
  const { disconnect: disconnectWagmi } = useDisconnectWagmi({ mutation: { onSettled: () => {
    console.log("disconnecting")
    LOCAL_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key)
    })
  }}})
  const config = useConfig()
  const disconnect = async () => {
    await disconnectWagmi(config)
    LOCAL_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key)
    })
  }

  return {
    disconnect: disconnectWagmi,
  }
  
}