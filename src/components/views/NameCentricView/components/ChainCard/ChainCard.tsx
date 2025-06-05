import { ChainCardHeader } from "./ChainCardHeader"
import { LoadingItem, NoneSet, RecordItem } from "./ChainCardContent"
import { PrimaryOption } from "../../primaryOptions"
import {
  AlertSVG,
  Button,
  CheckCircleSVG,
  Typography,
} from "@ensdomains/thorin"
import { useUniveralResolverPrimaryName } from "../../hooks/useUniveralResolverPrimaryName"
import { useParams } from "react-router"
import { Address } from "viem"
import { usePrimaryNameSource } from "../../hooks/usePrimaryNameSource/usePrimaryNameSource"
import { useAddressRecord } from "../../hooks/useAddressRecord"
import { match, P } from "ts-pattern"
import { useTransactionStore } from "../../stores/transactionStore"
import { TagWithTooltip } from "../TagWithTooltip/TagWithTooltip"
import { TagWithIcon } from "../TagWithIcon/TagWithIcon"
import { contentContainer, labelContainer } from "./ChainCardContent.css"

export type NameStatus =
  | "loading"
  | "fetching"
  | "active"
  | "inherited"
  | "syncing"
  | "incomplete"
  | "none-set"

export const ChainCard = (option: PrimaryOption) => {
  const { createTransactionFlow } = useTransactionStore()
  const { identifier: address } = useParams<{ identifier: Address }>()

  const {
    data: resolvedValue,
    isLoading: isResolvedLoading,
    isFetching: isResolvedFetching,
    ...rest
  } = useUniveralResolverPrimaryName({
    address: address as Address,
    coinType: option.chain.coinType,
  })

  console.log('cointype', option.chain.name, option.chain.coinType)
  console.log('resolvedValue', option.name, resolvedValue)

  const {
    data: sourceValue,
    isLoading: isSourceLoading,
    isFetching: isSourceFetching,
  } = usePrimaryNameSource({
    address: address as Address,
    primaryNameOptionId: option.id,
  })

  console.log('sourceValue', option.name, sourceValue)

  const {
    data: addressRecord,
    isLoading: isAddressRecordLoading,
    isFetching: isAddressRecordFetching,
    ...restAddressRecord
  } = useAddressRecord({
    name: sourceValue,
    coinType: option.chain.coinType,
  })

  const isLoading =
    isResolvedLoading || isSourceLoading || isAddressRecordLoading
  const isFetching =
    isResolvedFetching || isSourceFetching || isAddressRecordFetching

  const status: NameStatus = match({
    isLoading,
    isFetching,
    isResolved: !!resolvedValue,
    isSourced: !!sourceValue,
    isRecordSet: addressRecord === address,
  })
    .with(
      {
        isLoading: true,
      },
      () => "loading" as const,
    )
    .with(
      {
        isFetching: true,
      },
      () => "fetching" as const,
    )
    .with({ isResolved: true, isSourced: true }, () => "active" as const)
    .with({ isResolved: true, isSourced: false }, () => "inherited" as const)
    .with(
      { isResolved: false, isSourced: true, isRecordSet: true },
      () => "syncing" as const,
    )
    .with(
      { isResolved: false, isSourced: true, isRecordSet: false },
      () => "incomplete" as const,
    )
    .with({ isResolved: false, isSourced: false }, () => "none-set" as const)
    .exhaustive()

  return (
    <>
      <ChainCardHeader {...option} />
      {option.description && (
        <Typography fontVariant='small'>{option.description}</Typography>
      )}
      <div className={contentContainer}>
        <div className={labelContainer}>
          <Typography fontVariant='bodyBold' color='textSecondary'>
            Primary name
          </Typography>
          {match(status)
            .with(P.union("active", "inherited"), () => (
              <TagWithIcon
                icon={CheckCircleSVG}
                colorStyle='greenSecondary'
                size='small'
              >
                Active
              </TagWithIcon>
            ))
            .with("incomplete", () => (
              <TagWithTooltip
                icon={AlertSVG}
                content={`To use ${sourceValue} as your Primary Name you musth update the ${option.chain.name} record`}
                colorStyle='redSecondary'
              >
                Incomplete
              </TagWithTooltip>
            ))
            .with("syncing", () => (
              <TagWithTooltip
                icon={AlertSVG}
                content={`This has been updated to ${sourceValue}. This change may take up to ${option.chain.syncTime} to complete.`}
                colorStyle='yellowSecondary'
              >
                Syncing
              </TagWithTooltip>
            ))
            .otherwise(() => null)}
        </div>
        {match(status)
          .with("none-set", () => <NoneSet />)
          .with("loading", () => <LoadingItem />)
          .otherwise(() => (
            <RecordItem
              value={resolvedValue!}
              inherited={status === "inherited"}
            />
          ))}
      </div>
      {match(status)
        .with("syncing", () => (
          <Button colorStyle='accentSecondary' disabled>
            Syncing
          </Button>
        ))
        .with("loading", () => <LoadingItem />)
        .with("fetching", () => (
          <Button colorStyle='accentSecondary' disabled>
            Updating
          </Button>
        ))
        .with("active", () => (
          <Button colorStyle='accentSecondary'>Update</Button>
        ))
        .with("incomplete", () => (
          <Button colorStyle='accentSecondary'>Update record</Button>
        ))
        .with(P.union("inherited", "none-set"), () => (
          <Button
            colorStyle='accentSecondary'
            onClick={() => {
              createTransactionFlow({
                key: `wallet:${address}`,
                type: "wallet-centric",
                targetAddress: address,
                nameData: null,
                primaryNameOptionId: option.id,
                targetChainId: option.chain.id,
              })
            }}
          >
            Set
          </Button>
        ))
        .exhaustive()}
    </>
  )
}
