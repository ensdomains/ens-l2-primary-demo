import { Button } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { disconnect } from "wagmi/actions"
import { useAccount } from "wagmi"
import { shortenAddress } from "@/utils/address"
import { chains } from "@/constants/chains"
import { useConfig } from "wagmi"

export const WalletConnectButton = () => {
  const { address, chainId } = useAccount()
  const config = useConfig()

  const { openConnectModal } = useConnectModal()
  if (address) {
    return <>
    <div>{shortenAddress(address)}:{chains.find((chain) => chain.id === chainId)?.name}</div>
    <button onClick={() => disconnect(config)}>disconnect</button>
    </>
  }
  return <Button width="min" onClick={() => {
    openConnectModal?.()
  }}>Connect</Button>
}