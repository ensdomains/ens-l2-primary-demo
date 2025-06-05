import { Button } from "@ensdomains/thorin"
import { useTransactionStore } from "../stores/transactionStore"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect } from "react"
import { watchAccount } from "wagmi/actions"
import { useAccount } from "wagmi"
export const WalletConnectButton = () => {
  const{view, targetAddress: walletAddress, setWalletAddress} = useTransactionStore()
  const { address } = useAccount()
  console.log("address", address)
  useEffect(() => {
    (() => {
      if (address && view !== "main") return
      setWalletAddress(address)
    })()
  }, [address])

  const { openConnectModal } = useConnectModal()
  if (walletAddress) {
    return <div>{walletAddress}</div>
  }
  return <Button width="min" onClick={() => {
    openConnectModal?.()
  }}>Connect</Button>
}