import { SelectAddressComponent } from "@/components/atoms/SelectAddressComponent/SelectAddressComponent"
import { SelectChainsComponent } from "@/components/atoms/SelectChainsComponent/SelectChainsComponent"
import { isDefined, isValidPrimaryNameOptionId } from "@/utils/predicates"
import {
  ViewToViewProps,
  useTransactionStore,
  ViewBase,
  View,
} from "@/stores/transactionStore"
import { nameDataCoinTypesWithAddress } from "@/utils/nameData"
import { Button, Dialog } from "@ensdomains/thorin"
import { match, P } from "ts-pattern"
import { Address, isAddress } from "viem"
import {
  isValidSetPrimaryNameView,
  SetPrimaryNameView,
} from "../SetPrimaryNameView/SetPrimaryNameView"
import {
  isValidSetRecordsView,
  SetRecordsView,
} from "../SetRecordsView/SetRecordsView"
import {
  filterUnneededWarning,
  isValidSyncTimeWarningView,
  SyncTimeWarningView,
} from "../SyncTimeWarning/SyncTimeWarning"
import { ButtonWithBackButton } from "@/components/molecules/ButtonWithBackButton/ButtonWithBackButton"

export interface SelectAddressWithChainsView extends ViewBase {
  name: "select-address-with-chains"
  type: "input"
  primaryNameOptionId: number
  targetAddress: string | Address
  addressData: { address: Address; name: string }[]
  coinTypes: number[]
  subView?: "select-address" | "select-chains"
}

export const isValidSelectAddressWithChainsView = {
  name: "select-address-with-chains",
  type: "input",
  primaryNameOptionId: isValidPrimaryNameOptionId,
  addressData: P.array({ address: P.string, name: P.string }),
} as const

export const calculateSelectAddressWithChainsTransactionFlow = ({
  nameData,
  targetAddress,
  primaryNameOptionId,
  addressData,
  coinTypes,
}: SelectAddressWithChainsView): View[] => {
  if (!nameData || !targetAddress || !isAddress(targetAddress)) return []
  return [
    match({
      name: "set-primary-name",
      type: "transaction",
      nameData,
      targetAddress,
      primaryNameOptionId,
      sourceValue:
        addressData.find(({ address }) => address === targetAddress)?.name ??
        "",
    } satisfies SetPrimaryNameView)
      .with(isValidSetPrimaryNameView, (view) => view)
      .otherwise(() => undefined),
    match({
      name: "set-records",
      type: "transaction",
      nameData,
      targetAddress,
      primaryNameOptionId,
      coinTypes: coinTypes.filter(
        (coinType) =>
          !nameData.coins.some(
            (c) => c.coinType === coinType && c.value === targetAddress,
          ),
      ),
    } satisfies SetRecordsView)
      .with(isValidSetRecordsView, (view) => view)
      .otherwise(() => undefined),
    match({
      name: "sync-time-warning",
      type: "info",
      primaryNameOptionId,
    } satisfies SyncTimeWarningView)
      .with(isValidSyncTimeWarningView, (view) => view)
      .otherwise(() => undefined),
  ]
    .filter(isDefined)
    .filter(filterUnneededWarning)
}

export const SelectAddressWithChainsView = ({
  nameData,
  targetAddress,
  addressData,
  coinTypes,
  subView = "select-address",
}: ViewToViewProps<SelectAddressWithChainsView>) => {
  const {
    updateView,
    getCurrentViewPosition,
    increment,
    hasNext,
    generateTransactions,
    dismiss,
  } = useTransactionStore()

  const onAddressChange = (address: string) => {
    updateView(getCurrentViewPosition(), {
      targetAddress: address,
      coinTypes: nameDataCoinTypesWithAddress({ nameData, address }),
    })
    generateTransactions()
  }

  const onCoinTypesChange = (coinType: number, selected: boolean) => {
    updateView(getCurrentViewPosition(), {
      coinTypes: [
        ...coinTypes.filter((c) => c !== coinType),
        ...(selected ? [coinType] : []),
      ],
    })
    generateTransactions()
  }

  return (
    <>
      <Dialog.Heading
        title={
          subView === "select-address" ? "Choose an address" : "Choose chains"
        }
      />
      <Dialog.Content>
        {match(subView)
          .with("select-address", () => (
            <SelectAddressComponent
              selectedAddress={targetAddress}
              addressData={addressData}
              onChange={onAddressChange}
            />
          ))
          .with("select-chains", () => (
            <SelectChainsComponent
              selectedCoinTypes={coinTypes}
              previousCoinTypes={nameDataCoinTypesWithAddress({
                nameData,
                address: targetAddress,
              })}
              onChange={onCoinTypesChange}
            />
          ))
          .exhaustive()}
      </Dialog.Content>
      <Dialog.Footer
        leading={match(subView)
          .with("select-address", () => (
            <Button colorStyle='accentSecondary' onClick={dismiss}>
              Cancel
            </Button>
          ))
          .otherwise(() => undefined)}
        trailing={match(subView)
          .with("select-address", () => (
            <Button
              colorStyle='accentPrimary'
              onClick={() => {
                updateView(getCurrentViewPosition(), {
                  subView: "select-chains",
                })
              }}
              disabled={!isAddress(targetAddress)}
            >
              Next
            </Button>
          ))
          .otherwise(() => (
            <ButtonWithBackButton
              colorStyle='accentPrimary'
              disabled={!hasNext()}
              onClick={() => {
                increment()
              }}
              onBack={() => {
                updateView(getCurrentViewPosition(), {
                  subView: "select-address",
                })
              }}
            >
              Next
            </ButtonWithBackButton>
          ))}
      />
    </>
  )
}
