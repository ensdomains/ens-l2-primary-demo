import type { RegistrationStatus } from "@/hooks/useRegistrationStatus"
import { Banner } from "@ensdomains/thorin"
import { match, P } from "ts-pattern"
import { ethereum } from "@/constants/chains"

const getENSLink = (name: string) => {
  return match(ethereum.id)
    .with(11155111, () => `https://sepolia.app.ens.domains/${name}`)
    .otherwise(() => `https://app.ens.domains/${name}`)
}

export const NameCentricViewBanner = ({
  name,
  registrationStatus,
  isLoading,
}: {
  name: string
  registrationStatus?: RegistrationStatus
  isLoading?: boolean
}) => {
  if (isLoading) return null
  return match(registrationStatus)
    .with(P.union("registered", "owned", "imported", P.nullish), () => null)
    .with("available", () => (
      <Banner
        alert='warning'
        as='a'
        href={getENSLink(name)}
        target='_blank'
        rel='noopener noreferrer'
        title={`${name} is available.`}
        style={{ wordBreak: 'break-all' }}
      >
        Click here to register.
      </Banner>
    ))
    .with(P.union("invalid", "unsupportedTLD", "short"), () => (
      <Banner alert='error' title='Invalid name' style={{ wordBreak: 'break-all' }}>
        {name} is invalid. Please search for a different name.
      </Banner>
    ))
    .with(P.union("notOwned", "notImported"), () => (
      <Banner alert='error' title='Name not found' style={{ wordBreak: 'break-all' }}>
        {name} was not found in the registry. Please search for a different
        name.
      </Banner>
    ))
    .with("offChain", () => (
      <Banner alert='warning' title='Feature not available' style={{ wordBreak: 'break-all' }}>
        {name} is not registered on chain. Setting a primary names is not
        available.
      </Banner>
    ))
    .with("desynced", () => (
      <Banner
        alert='error'
        title='Name is out of sync'
        as='a'
        href={getENSLink(name)}
        target='_blank'
        rel='noopener noreferrer'
        style={{ wordBreak: 'break-all' }}
      >
        {name} is out of sync. Click here to go to the manager app to repair
        this name.
      </Banner>
    ))
    .with("gracePeriod", () => (
      <Banner
        alert='warning'
        title='Expiring soon'
        as='a'
        href={getENSLink(name)}
        target='_blank'
        rel='noopener noreferrer'
        style={{ wordBreak: 'break-all' }}
      >
        {name} is in the grace period. Click here to go to the manager app to
        renew it.
      </Banner>
    ))
    .exhaustive()
}
