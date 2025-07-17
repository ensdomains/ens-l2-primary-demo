import {
  Button,
  ExitSVG,
  Profile,
  PersonSVG,
  WalletSVG,
} from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { chains } from "@/constants/chains"
import { useDisconnect } from "@/hooks/useDisconnect"
import { useResolvedPrimaryName } from "@/hooks/useResolvedPrimaryName"
import { useZorb } from "@/hooks/useZorb/useZorb"
import { useEnsAvatar } from "@/hooks/useEnsAvatar"
import { Divider } from "./Divider/Divider"
import { shortenAddress } from "@/utils/address"
import { Link } from "react-router"

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
    return (
      <Profile
        address={address}
        ensName={primaryName}
        avatar={avatar ?? zorb}
        minWidth={"48"}
        dropdownItems={[
          ...(primaryName ? [{
            label: "My name",
            icon: PersonSVG,
            wrapper: (children: React.ReactNode) => <Link to={`/${primaryName}`}>{children}</Link>,
          }] : []),
          {
            label: shortenAddress(address),
            icon: WalletSVG,
            wrapper: (children: React.ReactNode) => <Link to={`/${address}`}>{children}</Link>,
          },
          <Divider />,
          {
            label: "Disconnect",
            icon: ExitSVG,
            color: "redPrimary",
            onClick: () => {
              disconnect()
            },
          },
        ]}
      />
    )
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
