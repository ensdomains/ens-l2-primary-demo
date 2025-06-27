import { Dialog, Input, Button, Helper } from "@ensdomains/thorin"
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton"
import { useEffect, useState } from "react"
import useDebouncedCallback from "@/hooks/useDebouncedCallback"
import { container, loading } from "./SelectNameView.css"
import { match, P } from "ts-pattern"
import { useNameData } from "@/hooks/useNameData"
import { NameItem } from "./components/NameItem"
import {
  useTransactionStore,
  ViewBase,
  ViewToViewProps,
} from "@/stores/transactionStore"
import { nameDataHasRecord } from "@/utils/nameData"
import { Address, isAddress } from "viem"
import { isDefined, isValidAddress } from "@/utils/predicates"
import { isValidPrimaryNameOptionId } from "@/utils/predicates"
import {
  isValidSetPrimaryNameView,
  SetPrimaryNameView,
} from "../SetPrimaryNameView/SetPrimaryNameView"
import {
  isValidSetRecordView,
  SetRecordView,
} from "../SetRecordView/SetRecordView"
import {
  filterUnneededWarning,
  isValidSyncTimeWarningView,
  SyncTimeWarningView,
} from "../SyncTimeWarning/SyncTimeWarning"

export interface SelectNameView extends ViewBase {
  name: "select-name"
  type: "input"
  targetAddress: Address
  sourceValue?: string
  primaryNameOptionId: number
}

export const isValidSelectNameView = {
  name: "select-name",
  type: "input",
  primaryNameOptionId: isValidPrimaryNameOptionId,
  targetAddress: isValidAddress,
} as const

export const calculateSelectNameTransactionFlow = ({
  nameData,
  targetAddress,
  primaryNameOptionId,
  sourceValue,
}: SelectNameView) => {
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
      name: "set-record",
      type: "transaction",
      nameData,
      targetAddress,
      primaryNameOptionId,
    } satisfies SetRecordView)
      .with(isValidSetRecordView, (view) => view)
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

export const SelectNameView = ({
  nameData,
  targetAddress,
  primaryNameOption,
}: ViewToViewProps<SelectNameView>) => {
  const {
    increment,
    hasNext,
    dismiss,
    updateView,
    getCurrentViewPosition,
    generateTransactions,
  } = useTransactionStore()

  const [value, setValue] = useState(nameData?.name || "")
  const [debouncedValue, _setDebouncedValue] = useState(nameData?.name || "")
  const setDebouncedValue = useDebouncedCallback(_setDebouncedValue, 500)

  const { data: searchedNameData, isFetching } = useNameData({
    name: debouncedValue,
    enabled: debouncedValue === value && debouncedValue.length > 3,
  })

  useEffect(() => {
    updateView(getCurrentViewPosition(), {
      nameData: searchedNameData,
    })
    generateTransactions()
  }, [searchedNameData])

  const showWarning =
    !!searchedNameData &&
    !nameDataHasRecord({
      nameData: searchedNameData,
      coinType: primaryNameOption.chain.coinType,
      value: targetAddress,
    })

  return (
    <>
      <Dialog.Heading title='Choose a name' />
      <Dialog.Content>
        <div className={container}>
          <Input
            label='Search'
            placeholder='Enter a name'
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setDebouncedValue(e.target.value)
            }}
            onClickAction={() => {
              setValue("")
              setDebouncedValue("")
            }}
          />
          {match({ isFetching, nameData: searchedNameData })
            .with({ isFetching: true }, () => <Skeleton className={loading} />)
            .with({ nameData: P.nullish }, () => null)
            .with({ nameData: P.not(P.nullish) }, ({ nameData }) => (
              <NameItem
                nameData={nameData}
                primaryNameOption={primaryNameOption}
              />
            ))
            .otherwise(() => null)}
        </div>
        {showWarning && (
          <Helper alert='warning'>
            {`You will need to complete a second transaction to update the ${primaryNameOption?.chain.name} address on this name.`}
          </Helper>
        )}
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button
            colorStyle='accentSecondary'
            onClick={() => {
              dismiss()
            }}
          >
            Cancel
          </Button>
        }
        trailing={
          <Button
            onClick={() => {
              increment()
            }}
            disabled={!searchedNameData || !hasNext()}
          >
            Select
          </Button>
        }
      />
    </>
  )
}
