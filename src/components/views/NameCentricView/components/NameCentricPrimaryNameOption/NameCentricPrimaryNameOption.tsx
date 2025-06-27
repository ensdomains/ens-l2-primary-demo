import {
  OptionAction,
  PrimaryNameOptionStatus,
} from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionAddressRecordItem } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionDescription } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionTitle } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionContent } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { useNameData } from "@/hooks/useNameData"
import { useSourcePrimaryName } from "@/hooks/useSourcePrimaryName/useSourcePrimaryName"
import { useResolvedPrimaryName } from "@/hooks/useResolvedPrimaryName"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { Typography } from "@ensdomains/thorin"
import { Address } from "viem"
import { calculatePrimaryNameStatus } from "@/utils/calculatePrimaryNameStatus"

const transactionKey = (name: string, option: PrimaryOption) =>
  `name:${name}::option:${option.id}`

export const NameCentricPrimaryNameOption = ({
  name,
  option,
}: {
  name: string
  option: PrimaryOption
}) => {
  const { isFlowConfirming, createTransactionFlow } = useTransactionStore()

  const {
    data: nameData,
    isLoading: isNameDataLoading,
    isFetching: isNameDataFetching,
  } = useNameData({
    name,
    coinType: option.chain.coinType,
  })

  const address =
    (nameData?.coins.find((coin) => coin.coinType === option.chain.coinType)
      ?.value as Address) ?? null

  const {
    data: sourceValue,
    isLoading: isSourceLoading,
    isFetching: isSourceFetching,
  } = useSourcePrimaryName({
    address,
    primaryNameOptionId: option.id,
  })

  const {
    data: resolvedValue,
    isLoading: isResolvedLoading,
    isFetching: isResolvedFetching,
  } = useResolvedPrimaryName({
    address,
    coinType: option.chain.coinType,
  })

  const status: PrimaryNameOptionStatus = calculatePrimaryNameStatus({
    isLoading: isNameDataLoading || isSourceLoading || isResolvedLoading,
    isFetching: isNameDataFetching || isSourceFetching || isResolvedFetching,
    isConfirming: isFlowConfirming(transactionKey(name, option)),
    isResolved: !!resolvedValue,
    isSourced: !!sourceValue,
    isMatching: resolvedValue === sourceValue,
    isRecordSet: !!address && address !== EMPTY_ADDRESS,
  })

  return (
    <>
      <OptionTitle option={option} />
      <OptionDescription option={option} />
      <OptionContent
        label='Address'
        status={status}
        incompleteMsg='To use this as your Primary Name you must update the address record'
        syncingMsg='This has been updated to this address. This change may take up to 24 hours to complete.'
      >
        <OptionAddressRecordItem
          value={address}
          status={status}
          onDelete={() => {
            if (!address || !nameData) return
            createTransactionFlow(transactionKey(name, option), {
              views: [
                {
                  name: "delete-primary-name",
                  type: 'transaction',
                  primaryNameOptionId: option.id,
                  nameData,
                  targetAddress: address,
                }
              ],
            })
          }}
        />
      </OptionContent>
      {import.meta.env.DEV && (
        <div>
          <Typography fontVariant='extraSmall'>
            resolvedValue: {resolvedValue}
          </Typography>
          <Typography fontVariant='extraSmall'>
            sourceValue: {sourceValue}
          </Typography>
          <Typography fontVariant='extraSmall'>
            record:{" "}
            {
              nameData?.coins.find(
                (coin) => coin.coinType === option.chain.coinType,
              )?.value
            }
          </Typography>
        </div>
      )}
      <OptionAction
        status={status}
        onClick={() => {
          if (!nameData) return
          createTransactionFlow(transactionKey(name, option), {
            views: [
              {
                name: "select-address",
                type: "input",
                targetAddress: address,
                nameData: nameData,
                primaryNameOptionId: option.id,
                sourceValue: sourceValue ?? "dummy",
              }
            ],
          })
        }}
      />
    </>
  )
}
