import {
  Dialog,
  Input,
  Button,
  Helper,
} from "@ensdomains/thorin"
import { Skeleton } from "../../components/Skeleton/Skeleton"
import { useState } from "react"
import useDebouncedCallback from "../../hooks/useDebouncedCallback"
import { container, loading } from "./SelectNameView.css"
import { match, P } from "ts-pattern"
import { primaryNameOptions } from "../../primaryOptions"
import { useNameData } from "../../hooks/useNameData"
import { NameItem } from "./NameItem"
import { TransactionViewProps, useTransactionStore } from "../../stores/transactionStore"

export const SelectNameView = ({
  nameData,
  targetAddress,
  targetChainId,
  primaryNameOptionId,
}: TransactionViewProps) => {
  console.log("targetChainId", targetChainId)
  const primaryNameOption = primaryNameOptions.find(
    (option) => option.id === primaryNameOptionId,
  )
  const { setNameData, increment, currentKey } = useTransactionStore()

  const [value, setValue] = useState(nameData?.name || "")
  const [debouncedValue, _setDebouncedValue] = useState(nameData?.name || "")
  const setDebouncedValue = useDebouncedCallback(_setDebouncedValue, 500)

  const {
    data: searchedNameData,
    isFetching,
    ...rest
  } = useNameData({
    name: debouncedValue,
    enabled: debouncedValue === value && debouncedValue.length > 3,
  })
  console.log("searchedNameData", searchedNameData, rest)

  const isRecordMatching = searchedNameData?.coins.find(
    (coin) => coin.value === targetAddress,
  )

  const status = match({}).otherwise(() => "something")

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
              setValue(debouncedValue)
              setDebouncedValue(debouncedValue)
            }}
          />
          {match({ isFetching, nameData: searchedNameData })
            .with({ isFetching: true }, () => <Skeleton className={loading} />)
            .with({ nameData: P.nullish }, () => (
              <Skeleton className={loading} />
            ))
            .otherwise(() => (
              <NameItem {...searchedNameData} targetChainId={targetChainId} />
            ))}
        </div>
        <Helper alert='warning'>
          {`You will need to complete a second transaction to update the ${primaryNameOption?.chain.name} address on this name.`}
        </Helper>
      </Dialog.Content>
      <Dialog.Footer
        leading={<Button colorStyle='accentSecondary'>Cancel</Button>}
        trailing={<Button onClick={()=> {
          setNameData(currentKey!, searchedNameData)
          increment()
        }}>Select</Button>}
      />
    </>
  )
}
