import { useDisconnect as useDisconnectWagmi } from "wagmi"

const LOCAL_STORAGE_KEYS = ['rk-latest-id', 'wagmi.recentConnectorId', 'wagmi.store']

export const useDisconnect = () => {
  return useDisconnectWagmi({ mutation: { onSettled: () => {
    LOCAL_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key)
    })
  }}})
}