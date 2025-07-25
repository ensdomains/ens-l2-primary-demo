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
import { useTransactionStore } from "@/stores/transactionStore"
import { useEffect, useState } from "react"
import { Divider } from "./Divider/Divider"
import { shortenAddress } from "@/utils/address"
import { Link } from "react-router"
import { linkWrapper } from "./WalletConnectButton.css"

// NOTE: We will hide the button if there is a view open so that if the button needs to be re-rendered,
// the dropdwon will be properly positioned. We also need to debounce the state change so that the modal is
// gone before the button is rendered.
const useIsHeaderVisible = () => {
  const { getCurrentView } = useTransactionStore()
  const { view } = getCurrentView()
  const [isVisible, setIsVisible] = useState(!view)
  useEffect(() => {
    if (!view) setTimeout(() => setIsVisible(true), 0)
    else setIsVisible(false)
  }, [view])
  return isVisible
}


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

  const isVisible = useIsHeaderVisible()

  const { openConnectModal } = useConnectModal()

  if (!isVisible) return null
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
            wrapper: (children: React.ReactNode) => <Link to={`/${primaryName}`} className={linkWrapper}>{children}</Link>,
          }] : []),
          {
            label: shortenAddress(address),
            icon: WalletSVG,
            wrapper: (children: React.ReactNode) => <Link to={`/${address}`} className={linkWrapper}>{children}</Link>,
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
