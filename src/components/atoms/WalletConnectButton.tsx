import { Button, ExitSVG, Profile } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { chains } from "@/constants/chains"
import { useDisconnect } from "@/hooks/useDisconnect"
import { useResolvedPrimaryName } from "@/hooks/useResolvedPrimaryName"
import { useZorb } from "@/hooks/useZorb/useZorb"
import { useEnsAvatar } from "@/hooks/useEnsAvatar"

export const WalletConnectButton = () => {
  const { address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: primaryName } = useResolvedPrimaryName({
    address,
    coinType: chains.find((chain) => chain.id === chainId)?.coinType ?? 60,
  })

  const { data: avatar } = useEnsAvatar({
    name: primaryName,
  })

  const zorb = useZorb(address ?? "")

  const { openConnectModal } = useConnectModal()
  if (address) {
    return <Profile address={address} ensName={primaryName} avatar={avatar ?? zorb} dropdownItems={[{
      label: 'Disconnect',
      icon: ExitSVG,
      color: 'redPrimary',
      onClick: () => {
        disconnect()
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
