import {  Input} from "@ensdomains/thorin"
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton"
import { useEffect, useState } from "react"
import useDebouncedCallback from "@/hooks/useDebouncedCallback"
import { container, loading } from "./SelectNameComponent.css"
import { match, P } from "ts-pattern"
import { useNameData } from "@/hooks/useNameData"
import { NameItem } from "./components/NameItem"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { NameData } from "@/hooks/useNameData"
import { Address } from "viem"

type SelectNameComponentProps = {
  primaryNameOption: PrimaryOption
  nameData?: NameData | null
  targetAddress: Address
  onChange: (nameData?: NameData | null) => void
}

export const SelectNameComponent = ({
  nameData,
  primaryNameOption,
  onChange,
}: SelectNameComponentProps) => {
  const [value, setValue] = useState(nameData?.name || "")
  const [debouncedValue, _setDebouncedValue] = useState(nameData?.name || "")
  const setDebouncedValue = useDebouncedCallback(_setDebouncedValue, 500)

  const {
    data: searchedNameData,
    isFetching,
  } = useNameData({
    name: debouncedValue,
    enabled: debouncedValue === value && debouncedValue.length > 3,
  })

  useEffect(() => {
    onChange(searchedNameData)
  }, [searchedNameData])

  return (
    <>
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
    </>
  )
}
