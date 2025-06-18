import { Dialog, Input, Button } from "@ensdomains/thorin"
import { useEffect } from "react"
import { container } from "./SelectAddressView.css"
import {
  useTransactionStore,
  ViewBase,
  ViewToViewProps,
} from "@/stores/transactionStore"
import { isValidAddress } from "@/utils/address"
import { useSourcePrimaryName } from "@/hooks/useSourcePrimaryName/useSourcePrimaryName"
import { Address, isAddress } from "viem"
import { NameData } from "@/hooks/useNameData"
import { isDefined, isValidNameData } from "@/utils/predicates"
import { isValidPrimaryNameOptionId } from "@/utils/predicates"
import { match } from "ts-pattern"
import {
  isValidSetPrimaryNameView,
  SetPrimaryNameView,
} from "../SetPrimaryNameView/SetPrimaryNameView"
import {
  isValidSetRecordView,
  SetRecordView,
} from "../SetRecordView/SetRecordView"

export interface SelectAddressView extends ViewBase {
  name: "select-address"
  type: "input"
  sourceValue?: string
  primaryNameOptionId: number
  nameData: NameData
  targetAddress?: string
}

export const isValidSelectAddressView = {
  name: "select-address",
  type: "input",
  primaryNameOptionId: isValidPrimaryNameOptionId,
  nameData: isValidNameData,
} as const

export const calculateSelectAddressTransactionFlow = ({
  nameData,
  targetAddress,
  primaryNameOptionId,
}: SelectAddressView) => {
  if (!targetAddress || !isAddress(targetAddress)) return []
  return [
    match({
      name: "set-name",
      type: "transaction",
      nameData,
      targetAddress,
      primaryNameOptionId,
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
  ].filter(isDefined)
}

export const SelectAddressView = ({
  nameData,
  targetAddress = "",
  primaryNameOption,
}: ViewToViewProps<SelectAddressView>) => {
  const {
    generateTransactions,
    increment,
    hasNext,
    updateView,
    getCurrentViewPosition,
    dismiss,
  } = useTransactionStore()

  const {
    data: sourceValue,
    isLoading,
    isFetching,
  } = useSourcePrimaryName({
    address: targetAddress as Address,
    primaryNameOptionId: primaryNameOption.id,
    enabled: isValidAddress(targetAddress),
  })

  // react query deprecated onSuccess so now we have to use a useEffect to update the view
  useEffect(() => {
    updateView(getCurrentViewPosition(), {
      sourceValue: sourceValue ?? "",
    })
  }, [sourceValue])

  const isLoadingOrFetching = isLoading || isFetching

  return (
    <>
      <Dialog.Heading title='Choose an address' />
      <Dialog.Content>
        <div className={container}>
          <Input
            label='Search'
            placeholder='Enter an address'
            value={targetAddress}
            onChange={(e) => {
              updateView(getCurrentViewPosition(), {
                targetAddress: e.target.value,
              })
              generateTransactions()
            }}
            onClickAction={() => {
              updateView(getCurrentViewPosition(), {
                targetAddress: "",
              })
              generateTransactions()
            }}
          />
        </div>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle='accentSecondary' onClick={dismiss}>
            Cancel
          </Button>
        }
        trailing={
          <Button
            onClick={() => {
              if (!isValidAddress(targetAddress)) return
              increment()
            }}
            loading={isLoadingOrFetching}
            disabled={!hasNext() || isLoadingOrFetching}
          >
            Select
          </Button>
        }
      />
    </>
  )
}
