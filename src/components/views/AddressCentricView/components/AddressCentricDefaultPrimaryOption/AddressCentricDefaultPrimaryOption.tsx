import {
  OptionAction,
  OptionNameRecordItem,
  OptionSupportedChains,
  PrimaryNameOptionStatus,
} from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionDescription } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionTitle } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionContent } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { useNameData } from "@/hooks/useNameData"
import { useSourcePrimaryName } from "@/hooks/useSourcePrimaryName/useSourcePrimaryName"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { Typography } from "@ensdomains/thorin"
import { match } from "ts-pattern"
import { Address } from "viem"

export const transactionKey = (address: Address, option: PrimaryOption) =>
  `address:${address}::option:${option.id}`

export const AddressCentricDefaultPrimaryOption = ({
  address,
  option,
}: {
  address: Address
  option: PrimaryOption
}) => {
  const { transactions, createTransactionFlow } = useTransactionStore()

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
    name: sourceValue || undefined,
  })

  const status: PrimaryNameOptionStatus = match({
    isLoading: isSourceLoading || isNameDataLoading,
    isFetching: isSourceFetching || isNameDataFetching,
    isConfirming:
      transactions[transactionKey(address, option)]?.status === "sent",
    isSourced: !!sourceValue,
  })
    .with(
      {
        isConfirming: true,
      },
      () => "confirming" as const,
    )
    .with(
      {
        isLoading: true,
      },
      () => "loading" as const,
    )
    .with(
      {
        isFetching: true,
      },
      () => "fetching" as const,
    )
    .with({ isSourced: true }, () => "active" as const)
    .with({ isSourced: false }, () => "none-set" as const)
    .exhaustive()

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
          value={sourceValue ?? ""}
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
      <OptionSupportedChains nameData={nameData} address={address} />
      {import.meta.env.DEV && (
        <div>
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
                name: "select-name-with-chains",
                type: "input",
                primaryNameOptionId: option.id,
                nameData: nameData ?? null,
                targetAddress: address,
                sourceValue: sourceValue ?? undefined,
              },
            ],
            viewIndex: 0,
          })
        }
      />
    </>
  )
}
