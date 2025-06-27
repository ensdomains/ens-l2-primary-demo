import { Button, ExitSVG, Profile } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { disconnect } from "wagmi/actions"
import { useAccount, useEnsAvatar } from "wagmi"
import { chains, ethereum } from "@/constants/chains"
import { useConfig } from "wagmi"
import { useResolvedPrimaryName } from "@/hooks/useResolvedPrimaryName"
import { useZorb } from "@/hooks/useZorb/useZorb"

export const WalletConnectButton = () => {
  const { address, chainId } = useAccount()
  const config = useConfig()

  const { data: primaryName } = useResolvedPrimaryName({
    address,
    coinType: chains.find((chain) => chain.id === chainId)?.coinType ?? 60,
  })

  const { data: avatar } = useEnsAvatar({
    name: primaryName,
    chainId: ethereum.id,
    query: {
      enabled: !!primaryName,
    }
  })

  const zorb = useZorb(address ?? "")

  const { openConnectModal } = useConnectModal()
  if (address) {
    return <Profile address={address} ensName={primaryName} avatar={avatar ?? zorb} dropdownItems={[{
      label: 'Disconnect',
      icon: ExitSVG,
      color: 'redPrimary',
      onClick: () => {
        disconnect(config)
      }
    }]}/>
  }
  return (
    <Button
      width='min'
      onClick={() => {
        openConnectModal?.()
      }}
    >
      Connect
    </Button>
  )
}
