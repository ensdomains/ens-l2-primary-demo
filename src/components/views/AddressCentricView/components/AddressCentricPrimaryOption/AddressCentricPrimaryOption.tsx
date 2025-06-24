import {
  OptionAction,
  OptionNameRecordItem,
} from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionDescription } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionTitle } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionContent } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { useNameData } from "@/hooks/useNameData"
import { useSourcePrimaryName } from "@/hooks/useSourcePrimaryName/useSourcePrimaryName"
import { useResolvedPrimaryName } from "@/hooks/useResolvedPrimaryName"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { Typography } from "@ensdomains/thorin"
import { Address } from "viem"
import { calculatePrimaryNameStatus } from "@/utils/calculatePrimaryNameStatus"

export const transactionKey = (address: Address, option: PrimaryOption) =>
  `address:${address}::option:${option.id}`

export const AddressCentricPrimaryOption = ({
  address,
  option,
}: {
  address: Address
  option: PrimaryOption
}) => {
  const { isFlowConfirming, createTransactionFlow } = useTransactionStore()

  const {
    data: resolvedValue,
    isLoading: isResolvedLoading,
    isFetching: isResolvedFetching,
  } = useResolvedPrimaryName({
    address: address as Address,
    coinType: option.chain.coinType,
  })

  const {
    data: sourceValue,
    isLoading: isSourceLoading,
    isFetching: isSourceFetching,
  } = useSourcePrimaryName({
    address: address as Address,
    primaryNameOptionId: option.id,
  })

  const {
    data: nameData,
    isLoading: isNameDataLoading,
    isFetching: isNameDataFetching,
  } = useNameData({
    name: sourceValue || resolvedValue || undefined,
  })

  const status = calculatePrimaryNameStatus({
    isLoading: isResolvedLoading || isSourceLoading || isNameDataLoading,
    isFetching: isResolvedFetching || isSourceFetching || isNameDataFetching,
    isConfirming: isFlowConfirming(transactionKey(address, option)),
    isResolved: !!resolvedValue,
    isSourced: !!sourceValue,
    isMatching: resolvedValue === sourceValue,
    isRecordSet:
      nameData?.coins.find((coin) => coin.coinType === option.chain.coinType)
        ?.value === address,
  })


  return (
    <>
      <OptionTitle option={option} />
      <OptionDescription option={option} />
      <OptionContent
        label='Primary Name'
        status={status}
        incompleteMsg={`To use ${sourceValue} as your Primary Name you must update the ${option.chain.name} record`}
        syncingMsg={`This has been updated to ${sourceValue}. This change may take up to ${option.chain.syncTime} to complete.`}
      >
        <OptionNameRecordItem
          value={resolvedValue ?? ""}
          status={status}
          onDelete={() => {
            if (!nameData) return
            createTransactionFlow(transactionKey(address, option), {
              views: [
                {
                  name: "delete-primary-name",
                  type: "transaction",
                  nameData,
                  targetAddress: address,
                  primaryNameOptionId: option.id,
                },
              ],
              viewIndex: 0,
            })
          }}
        />
      </OptionContent>
      {import.meta.env.DEV && (
        <div>
          <Typography fontVariant='extraSmall'>
            resolved value: {resolvedValue}
          </Typography>
          <Typography fontVariant='extraSmall'>
            source value: {sourceValue}
          </Typography>
          <Typography fontVariant='extraSmall'>
            address record:{" "}
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
        onClick={() =>
          createTransactionFlow(transactionKey(address, option), {
            views: [
              {
                name: "select-name",
                type: "input",
                nameData: nameData ?? null,
                targetAddress: address,
                primaryNameOptionId: option.id,
                sourceValue: sourceValue || undefined,
              },
            ],
            viewIndex: 0,
          })
        }
      />
    </>
  )
}
