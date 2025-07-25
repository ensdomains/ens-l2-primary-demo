import { useTransactionStore } from "@/stores/transactionStore"
import { tryPredicate } from "@/utils/tryPredicate"
import { Dialog, Typography } from "@ensdomains/thorin"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Address } from "viem"
import { useConfig, useDisconnect } from "wagmi"
import { ChangeAddressView } from "./views/ChangeAddressView/ChangeAddressView"
import { match } from "ts-pattern"
import { useEffect, useState } from "react"
import { ChangeChainView } from "./views/ChangeChainView/ChangeChainView"
import { chains } from "@/constants/chains"
import { ButtonWithBackButton } from "@/components/molecules/ButtonWithBackButton/ButtonWithBackButton"

export const SyncWalletAndNetworkView = ({
  status,
  title,
  subtitle,
  subtitle2,
  helperText,
  requiredAddress,
  requiredChainId,
}: {
  status: "syncAddress" | "syncChain"
  requiredAddress: Address
  requiredChainId: number
  title: string
  subtitle?: React.ReactNode
  subtitle2?: React.ReactNode
  helperText: React.ReactNode
  onBack?: () => void
}) => {
  const config = useConfig()
  const { decrement } = useTransactionStore()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()

  const network =
    chains.find((chain) => chain.id === requiredChainId)?.name || "unknown"

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
          .with("syncAddress", () => title)
          .with("syncChain", () => `Cannot connect to ${network}`)
          .exhaustive()}
        alert={status === "syncChain" ? "warning" : undefined}
      />
      <Dialog.Content>
        {match(status)
          .with("syncAddress", () => (
            <ChangeAddressView
              subtitle={subtitle}
              subtitle2={subtitle2}
              helperText={helperText}
            />
          ))
          .with("syncChain", () => (
            <ChangeChainView
              requiredChainId={requiredChainId}
              requiredAddress={requiredAddress}
            />
          ))
          .exhaustive()}
        {import.meta.env.DEV && (
          <div>
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
        trailing={
          <ButtonWithBackButton
            colorStyle='accentPrimary'
            onBack={decrement}
            onClick={async () => {
              await disconnect()
              await tryPredicate(
                async () => config.state.status === "disconnected",
              )
              setShouldOpenConnectModal(true)
            }}
          >
            Switch connection
          </ButtonWithBackButton>
        }
      />
    </>
  )
}
