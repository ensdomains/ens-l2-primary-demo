import { Banner, Input, MagnifyingGlassSVG } from "@ensdomains/thorin"
import { useNavigate } from "react-router"
import { useState } from "react"
import { isAddress } from "viem"
import { normalizeName } from "@/components/pages/IdentifierPage"

export const SearchInput = () => {
  const navigate = useNavigate()
  const [invalidName, setInvalidName] = useState<string | null>(null)

  const handleSearch = (value: string) => {
    try {
      if (isAddress(value)) {
        setInvalidName(null)
        navigate(`/${value}`)
      } else {
        const normalizedName = normalizeName(value)
        if (!normalizedName || normalizedName.trim() === '') {
          setInvalidName(value)
          return
        }
        setInvalidName(null)
        navigate(`/${normalizedName}`)
      }
    } catch (error) {
      setInvalidName(value)
    }
  }

  return (
    <>
      <Input
        label=""
        placeholder="Search for a name or address"
        icon={<MagnifyingGlassSVG />}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.currentTarget.value)
          }
        }}
      />
      {invalidName && (
        <Banner title="Invalid Name" alert="warning">
          {invalidName} is invalid. Please try another name.
        </Banner>
      )}
    </>
  )
}