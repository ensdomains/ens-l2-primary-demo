import { useParams } from "react-router"
import { Address, isAddress as __isAddress } from "viem"
import { NameCentricView } from "../views/NameCentricView/NameCentricView"
import { normalise } from "@ensdomains/ensjs/utils"
import { AddressCentricView } from "../views/AddressCentricView/AddressCentricView"

const isAddress = (identifier: string): identifier is Address => __isAddress(identifier)

const isName = (identifier: string): boolean => {
  if (identifier.endsWith(".eth") && identifier.length < 7) return false
  return !!identifier
}

const normalizeName = (name: string): string => {
  try {
    const nameWithTLD = name.indexOf(".") === -1 ? `${name}.eth` : name
    const normalizedName = normalise(nameWithTLD)
    return normalizedName.toLowerCase()
  } catch {
    return ""
  }
}


export const IdentifierPage = () => {
  
  const params = useParams<{ identifier: string}>()
  const identifier = params.identifier as string

  if (isAddress(identifier)) return <AddressCentricView address={identifier}/>

  const name = normalizeName(identifier)
  if (isName(name)) return <NameCentricView name={name} />

  // TODO: add error view
  return <div>Invalid identifier: {identifier}</div>
} 