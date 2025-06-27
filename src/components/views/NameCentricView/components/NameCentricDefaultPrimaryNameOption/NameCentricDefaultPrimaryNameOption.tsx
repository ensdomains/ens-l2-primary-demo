import {
  OptionAction,
  OptionSupportedChains,
  PrimaryNameOptionStatus,
} from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionAddressRecordItem } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionDescription } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionTitle } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { OptionContent } from "@/components/molecules/PrimaryNameOption/PrimaryNameOption"
import { useNameData } from "@/hooks/useNameData"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { useTransactionStore } from "@/stores/transactionStore"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"
import { Typography } from "@ensdomains/thorin"
import { match } from "ts-pattern"
import { useDefaultPrimaryNamesForAddresses } from "@/hooks/useDefaultPrimaryNamesForAddresses"
import { Divider } from "@/components/atoms/Divider/Divider"
import { isLastIndex } from "@/utils/array"
import { Fragment } from "react"
import { Address } from "viem"

const transactionKey = (name: string, option: PrimaryOption) =>
  `name:${name}::option:${option.id}`

export const NameCentricDefaultPrimaryNameOption = ({
  name,
  option,
}: {
  name: string
  option: PrimaryOption
}) => {
  const { createTransactionFlow, isFlowConfirming } = useTransactionStore()

  const {
    data: nameData,
    isLoading: isNameDataLoading,
    isFetching: isNameDataFetching,
  } = useNameData({
    name,
    coinType: option.chain.coinType,
  })

  const addresses =
    nameData?.coins
      .map((coin) => coin.value)
      .filter(
        (address, index, self) =>
          address !== EMPTY_ADDRESS && self.indexOf(address) === index,
      ) || []

  const defaultPrimaryNameAndAddressData = useDefaultPrimaryNamesForAddresses({
    addresses,
  })

  const definedDefaultPrimaryNameAndAddressData =
    defaultPrimaryNameAndAddressData
      .map(({ data }) => data)
      .filter((data): data is { name: string; address: Address } => !!data)

  const isDefaultPrimaryNameAddressesLoading =
    defaultPrimaryNameAndAddressData.some(({ isLoading }) => isLoading)
  const isDefaultPrimaryNameAddressesFetching =
    defaultPrimaryNameAndAddressData.some(({ isFetching }) => isFetching)

  const status: PrimaryNameOptionStatus | "" = match({
    isLoading: isNameDataLoading || isDefaultPrimaryNameAddressesLoading,
    isFetching: isNameDataFetching || isDefaultPrimaryNameAddressesFetching,
    isConfirming: isFlowConfirming(transactionKey(name, option)),
    count: definedDefaultPrimaryNameAndAddressData.length,
  })
    .with({ isConfirming: true }, () => "confirming" as const)
    .with({ isLoading: true }, () => "loading" as const)
    .with({ isFetching: true }, () => "fetching" as const)
    .otherwise(() => "active" as const)

  const addressOptions = match(definedDefaultPrimaryNameAndAddressData.length)
    .with(0, () => [{ address: EMPTY_ADDRESS as Address, status: "none-set" as const }])
    .otherwise(() =>
      definedDefaultPrimaryNameAndAddressData.map((data) => ({
        address: data.address,
        status: data.name === name ? ("active" as const) : ("incomplete" as const),
      })),
    )

  return (
    <>
      <OptionTitle option={option} />
      <OptionDescription option={option} />
      {addressOptions.map(({ address, status }, index, array) => {
        if (!address) return null
        return (
          <Fragment key={address}>
            <OptionContent
              label='Address'
              status={status}
              incompleteMsg={`This address has not set ${name} as it's default primary name`}
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
                        type: "transaction",
                        nameData,
                        targetAddress: address,
                        primaryNameOptionId: option.id,
                      },
                    ],
                  })
                }}
              />
            </OptionContent>
            <OptionSupportedChains nameData={nameData} address={address} />
            {!isLastIndex(index, array) && <Divider />}
          </Fragment>
        )
      })}
      {import.meta.env.DEV && (
        <div>
          {definedDefaultPrimaryNameAndAddressData.map(({ name, address }) => (
            <Typography fontVariant='extraSmall' key={address}>
              sourceValue: {name} : {address}
            </Typography>
          ))}
          {nameData?.coins.map((coin) => (
            <Typography fontVariant='extraSmall' key={coin.id}>
              record: {coin.id} : {coin.value}
            </Typography>
          ))}
        </div>
      )}
      <OptionAction
        status={status || "active"}
        onClick={() => {
          if (!nameData) return
          createTransactionFlow(transactionKey(name, option), {
            views: [
              {
                name: "select-address-with-chains",
                type: "input",
                addressData: definedDefaultPrimaryNameAndAddressData,
                nameData: nameData,
                primaryNameOptionId: option.id,
                targetAddress:
                  definedDefaultPrimaryNameAndAddressData?.[0]?.address ?? "",
                coinTypes: [],
              },
            ],
          })
        }}
      />
    </>
  )
}
