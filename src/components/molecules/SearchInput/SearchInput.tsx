import { Input, MagnifyingGlassSVG } from "@ensdomains/thorin"
import { useNavigate } from "react-router"
import { isAddress } from "viem"
import { normalizeName } from "@/components/pages/IdentifierPage"

export const SearchInput = () => {
  const navigate = useNavigate()

  return (
    <Input
      label=""
      placeholder="Search for a name or address"
      icon={<MagnifyingGlassSVG />}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (isAddress(e.currentTarget.value)) {
            navigate(`/${e.currentTarget.value}`)
          } else {
            navigate(`/${normalizeName(e.currentTarget.value)}`)
          }
        }
      }}
    />
  )
}