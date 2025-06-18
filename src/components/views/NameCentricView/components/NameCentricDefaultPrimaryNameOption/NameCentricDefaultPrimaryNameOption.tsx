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
import { match, P } from "ts-pattern"
import { useDefaultPrimaryNamesForAddresses } from "@/hooks/useDefaultPrimaryNamesForAddresses"
import { isDefined } from "@/utils/predicates"

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
  console.log("addresses", addresses)

  const defaultPrimaryNames = useDefaultPrimaryNamesForAddresses({
    addresses,
  })

  const defaultPrimaryNameAddresses = defaultPrimaryNames
    .filter(({ data }) => data?.name === name)
    .map(({ data }) => data?.address)
    .filter((address) => !!address)
  const isDefaultPrimaryNameAddressesLoading = defaultPrimaryNames.some(
    ({ isLoading }) => isLoading,
  )
  const isDefaultPrimaryNameAddressesFetching = defaultPrimaryNames.some(
    ({ isFetching }) => isFetching,
  )

  const status: PrimaryNameOptionStatus = match({
    isLoading: isNameDataLoading || isDefaultPrimaryNameAddressesLoading,
    isFetching: isNameDataFetching || isDefaultPrimaryNameAddressesFetching,
    isConfirming: isFlowConfirming(transactionKey(name, option)),
    count: defaultPrimaryNameAddresses.length,
  })
    .with({ isConfirming: true }, () => "confirming" as const)
    .with({ isLoading: true }, () => "loading" as const)
    .with({ isFetching: true }, () => "fetching" as const)
    .with({ count: 0 }, () => "none-set" as const)
    .otherwise(() => "active" as const)

  return (
    <>
      <OptionTitle option={option} />
      <OptionDescription option={option} />
      {defaultPrimaryNameAddresses.map((address) => (
        <>
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
                  views: [{
                    name: "delete-primary-name",
                    type: "transaction",
                    nameData,
                    targetAddress: address,
                    primaryNameOptionId: option.id,
                  }],
                })
              }}
            />
          </OptionContent>
          <OptionSupportedChains nameData={nameData} address={address} />
        </>
      ))}
      {import.meta.env.DEV && (
        <div>
          {defaultPrimaryNameAddresses.map((addr) => (
          <Typography fontVariant='extraSmall'>
            sourceValue: {addr}
          </Typography>))}
          {nameData?.coins.map((coin) => (
            <Typography fontVariant='extraSmall'>
              record: {coin.id} : {coin.value}
            </Typography>
          ))}
        </div>
      )}
      <OptionAction
        status={status}
        onClick={() => {
          if (!nameData) return
          createTransactionFlow(
            transactionKey(name, option),
            {
              views: [{
                name: "select-address-with-chains",
                type: "input",
                addressData: defaultPrimaryNames.map(({data}) => data).filter(isDefined),
                nameData: nameData,
                primaryNameOptionId: option.id,
                targetAddress: defaultPrimaryNames?.[0]?.data?.address ?? '',
                coinTypes: []
              }],            
          })
        }}
      />
    </>
  )
}
