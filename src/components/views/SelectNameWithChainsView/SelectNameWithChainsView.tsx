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
import { Button, Dialog, LeftArrowSVG } from "@ensdomains/thorin"
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
      name: "set-primary-name" as const,
      type: "transaction" as const,
      nameData,
      targetAddress,
      primaryNameOptionId,
      sourceValue,
    } satisfies SetPrimaryNameView)
      .with(isValidSetPrimaryNameView, (view) => view)
      .otherwise(() => undefined),
    match({
      name: "set-records" as const,
      type: "transaction" as const,
      nameData,
      targetAddress,
      primaryNameOptionId,
      coinTypes:
        coinTypes.filter((c) =>
          nameData.coins.some(
            (coin) => coin.coinType === c && coin.value === targetAddress,
          ),
        ) ?? [],
    } satisfies SetRecordsView)
      .with(isValidSetRecordsView, (view) => view)
      .otherwise(() => undefined),
  ].filter(isDefined)
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
      coinTypes: nameDataCoinTypesWithAddress({nameData, address: targetAddress}),
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
              disabledCoinTypes={nameDataCoinTypesWithAddress({
                nameData,
                address: targetAddress,
              })}
              onChange={(coinType, selected) => {
                updateView(getCurrentViewPosition(), {
                  coinTypes: coinTypes.filter((c) => c !== coinType),
                  ...(selected ? [coinType] : []),
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
          .otherwise(() => (
            <Button
              colorStyle='accentSecondary'
              shape='square'
              onClick={() => {
                updateView(getCurrentViewPosition(), { subView: "select-name" })
              }}
            >
              <LeftArrowSVG style={{ width: 16, height: 16 }} />
            </Button>
          ))}
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
            <Button
              colorStyle='accentPrimary'
              disabled={!hasNext()}
              onClick={() => {
                increment()
              }}
            >
              Next
            </Button>
          ))}
      />
    </>
  )
}
