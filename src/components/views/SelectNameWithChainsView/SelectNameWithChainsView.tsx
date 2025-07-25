import { SelectChainsComponent } from "@/components/atoms/SelectChainsComponent/SelectChainsComponent"
import { SelectNameComponent } from "@/components/atoms/SelectNameComponent/SelectNameComponent"
import { NameData } from "@/hooks/useNameData"
import {
  ViewToViewProps,
  useTransactionStore,
  ViewBase,
} from "@/stores/transactionStore"
import { isDefined, isValidPrimaryNameOptionId } from "@/utils/predicates"
import { isValidAddress } from "@/utils/predicates"
import { Button, Dialog } from "@ensdomains/thorin"
import { match } from "ts-pattern"
import { Address, isAddress } from "viem"
import {
  isValidSetPrimaryNameView,
  SetPrimaryNameView,
} from "../SetPrimaryNameView/SetPrimaryNameView"
import {
  isValidSetRecordsView,
  SetRecordsView,
} from "../SetRecordsView/SetRecordsView"
import { nameDataCoinTypesWithAddress } from "@/utils/nameData"
import {
  filterUnneededWarning,
  isValidSyncTimeWarningView,
  SyncTimeWarningView,
} from "../SyncTimeWarning/SyncTimeWarning"
import { ButtonWithBackButton } from "@/components/molecules/ButtonWithBackButton/ButtonWithBackButton"

export interface SelectNameWithChainsView extends ViewBase {
  name: "select-name-with-chains"
  type: "input"
  sourceValue?: string
  primaryNameOptionId: number
  targetAddress: Address
  coinTypes: number[]
  subView?: "select-name" | "select-chains"
}

export const isValidSelectNameWithChainsView = {
  name: "select-name-with-chains",
  type: "input",
  primaryNameOptionId: isValidPrimaryNameOptionId,
  targetAddress: isValidAddress,
} as const

export const calculateSelectNameWithChainsTransactionFlow = ({
  nameData,
  targetAddress,
  primaryNameOptionId,
  sourceValue,
  coinTypes,
}: SelectNameWithChainsView) => {
  if (!nameData || !isAddress(targetAddress)) return []
  return [
    match({
      name: "set-primary-name",
      type: "transaction",
      nameData,
      targetAddress,
      primaryNameOptionId,
      sourceValue,
    } satisfies SetPrimaryNameView)
      .with(isValidSetPrimaryNameView, (view) => view)
      .otherwise(() => undefined),
    match({
      name: "set-records",
      type: "transaction",
      nameData,
      targetAddress,
      primaryNameOptionId,
      coinTypes:
        coinTypes.filter(
          (c) =>
            !nameData.coins.some(
              (coin) => coin.coinType === c && coin.value === targetAddress,
            ),
        ) ?? [],
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

export const SelectNameWithChainsView = ({
  primaryNameOption,
  nameData,
  targetAddress,
  coinTypes,
  subView = "select-name",
}: ViewToViewProps<SelectNameWithChainsView>) => {
  const {
    updateView,
    getCurrentViewPosition,
    increment,
    hasNext,
    generateTransactions,
  } = useTransactionStore()

  const onNameDataChange = (nameData?: NameData | null) => {
    updateView(getCurrentViewPosition(), {
      nameData,
      coinTypes: nameDataCoinTypesWithAddress({
        nameData,
        address: targetAddress,
      }),
    })
    generateTransactions()
  }

  return (
    <>
      <Dialog.Heading
        title={subView === "select-name" ? "Choose a name" : "Choose chains"}
      />
      <Dialog.Content>
        {match(subView)
          .with("select-name", () => (
            <SelectNameComponent
              primaryNameOption={primaryNameOption}
              nameData={nameData}
              targetAddress={targetAddress}
              onChange={onNameDataChange}
            />
          ))
          .with("select-chains", () => (
            <SelectChainsComponent
              selectedCoinTypes={coinTypes}
              previousCoinTypes={nameDataCoinTypesWithAddress({
                nameData,
                address: targetAddress,
              })}
              onChange={(coinType, selected) => {
                updateView(getCurrentViewPosition(), {
                  coinTypes: [
                    ...coinTypes.filter((c) => c !== coinType),
                    ...(selected ? [coinType] : []),
                  ],
                })
                generateTransactions()
              }}
            />
          ))
          .exhaustive()}
      </Dialog.Content>
      <Dialog.Footer
        leading={match(subView)
          .with("select-name", () => (
            <Button colorStyle='accentSecondary' onClick={() => {}}>
              Cancel
            </Button>
          ))
          .otherwise(() => undefined)}
        trailing={match(subView)
          .with("select-name", () => (
            <Button
              colorStyle='accentPrimary'
              onClick={() => {
                updateView(getCurrentViewPosition(), {
                  subView: "select-chains",
                })
              }}
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
                updateView(getCurrentViewPosition(), { subView: "select-name" })
              }}
            >
              Next
            </ButtonWithBackButton>
          ))}
      />
    </>
  )
}
