import { useTransactionStore } from "@/stores/transactionStore"
import { tryPredicate } from "@/utils/tryPredicate"
import { Button, Dialog, Typography, LeftArrowSVG } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Address } from "viem"
import { useConfig } from "wagmi"
import { disconnect } from "wagmi/actions"
import { ChangeAddressView } from "./views/ChangeAddressView/ChangeAddressView"
import { match, P } from "ts-pattern"
import { useEffect, useState } from "react"
import { ChangeChainView } from "./views/ChangeChainView/ChangeChainView"
import { useAccountWithChainSwitch } from "@/hooks/useAccountWithChainSwitch"
import { chains } from "@/constants/chains"

export const SyncWalletAndNetworkView = ({
  title,
  subtitle,
  subtitle2,
  helperText,
  requiredAddress,
  requiredChainId,
}: {
  requiredAddress: Address
  requiredChainId: number
  title: string
  subtitle?: React.ReactNode
  subtitle2?: React.ReactNode
  helperText: React.ReactNode
  onBack?: () => void
}) => {
  const { address, chainId, hasSwitchedChain } = useAccountWithChainSwitch({
    requiredAddress,
    requiredChainId,
  })
  const config = useConfig()
  const { decrement } = useTransactionStore()
  const { openConnectModal } = useConnectModal()

  const network =
    chains.find((chain) => chain.id === requiredChainId)?.name || "unknown"

  const status = match({
    isAddressMatching: address === requiredAddress,
    isChainMatching: chainId === requiredChainId,
    hasSwitchedChain,
  })
    .with(
      {
        isChainMatching: true,
        isAddressMatching: true,
        hasSwitchedChain: P._,
      },
      () => "inSync" as const,
    )
    .with(
      { isAddressMatching: false },
      { isChainMatching: false, hasSwitchedChain: false },
      () => "addressMismatch" as const,
    )
    .with({ isChainMatching: false }, () => "chainMismatch" as const)
    .exhaustive()

  // This structure is needed because openConnectModal is not available
  // until after rerender.
  const [shouldOpenConnectModal, setShouldOpenConnectModal] = useState(false)
  useEffect(() => {
    let timeout: number
    if (shouldOpenConnectModal) {
      openConnectModal?.()
      timeout = window.setTimeout(() => setShouldOpenConnectModal(false), 1000)
    }
    return () => clearTimeout(timeout)
  }, [shouldOpenConnectModal])

  return (
    <>
      <Dialog.Heading
        title={match(status)
          .with("addressMismatch", () => title)
          .with("chainMismatch", () => `Cannot connect to ${network}`)
          .with("inSync", () => '')
          .exhaustive()}
        alert={status === "chainMismatch" ? "warning" : undefined}
      />
      <Dialog.Content>
        {match(status)
          .with("addressMismatch", () => (
            <ChangeAddressView
              subtitle={subtitle}
              subtitle2={subtitle2}
              helperText={helperText}
            />
          ))
          .with("chainMismatch", () => (
            <ChangeChainView
              requiredChainId={requiredChainId}
              requiredAddress={requiredAddress}
            />
          ))
          .with("inSync", () => null)
          .exhaustive()}
        {import.meta.env.DEV && (
          <div>
            <Typography fontVariant='extraSmall'>address: {address}</Typography>
            <Typography fontVariant='extraSmall'>chainId: {chainId}</Typography>
            <Typography fontVariant='extraSmall'>
              requiredAddress: {requiredAddress}
            </Typography>
            <Typography fontVariant='extraSmall'>
              requiredChainId: {requiredChainId}
            </Typography>
          </div>
        )}
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button
            colorStyle='accentSecondary'
            shape='square'
            onClick={decrement}
          >
            <LeftArrowSVG style={{ width: "1rem", height: "1rem" }} />
          </Button>
        }
        trailing={
          <Button
            colorStyle='accentPrimary'
            onClick={async () => {
              await disconnect(config)
              await tryPredicate(
                async () => config.state.status === "disconnected",
              )
              setShouldOpenConnectModal(true)
            }}
          >
            Switch connection
          </Button>
        }
      />
    </>
  )
}
