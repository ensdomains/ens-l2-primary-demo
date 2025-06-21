import { PrimaryOption } from "@/constants/primaryNameOptions"
import {
  AlertSVG,
  Button,
  Avatar,
  CheckSVG,
  CopySVG,
  CheckCircleSVG,
  Tag,
  TrashSVG,
} from "@ensdomains/thorin"
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton"
import { Typography } from "@ensdomains/thorin"
import {
  icon,
  title,
  container,
  supportedChainsContainer,
  supportedChainItemContainer,
  supportedChainItemIcon,
} from "./PrimaryNameOption.css"
import {
  contentContainer,
  labelContainer,
  recordItemContent,
  recordItemContentContainer,
  recordItemContainer,
  recordItemIcon,
  recordItemActionIcon,
  recordItemText,
  noneSet,
  loadingItem,
} from "./PrimaryNameOption.css"
import { match } from "ts-pattern"
import { TagWithIcon } from "@/components/atoms/TagWithIcon/TagWithIcon"
import { P } from "ts-pattern"
import { TagWithTooltip } from "@/components/atoms/TagWithTooltip/TagWithTooltip"
import { useEnsAvatar } from "wagmi"
import { useCopied } from "@/hooks/useCopied"
import { chains, ethereum } from "@/constants/chains"
import { shortenAddress } from "@/utils/address"
import { Address } from "viem"
import { NameData } from "@/hooks/useNameData"

export type PrimaryNameOptionStatus =
  | "loading"
  | "fetching"
  | "confirming"
  | "active"
  | "inherited"
  | "syncing"
  | "incomplete"
  | "none-set"

export const OptionTitle = ({ option }: { option: PrimaryOption }) => {
  return (
    <div className={container}>
      <div className={title}>
        <img src={option.icon} alt={option.name} className={icon} />
        <Typography fontVariant='largeBold'>{option.name}</Typography>
      </div>
      <div>
        {option.chain.syncTime && (
          <Tag colorStyle='blueSecondary'>{option.chain.syncTime} sync</Tag>
        )}
      </div>
    </div>
  )
}

export const OptionDescription = ({ option }: { option: PrimaryOption }) => {
  if (!option.description) return null
  return <Typography fontVariant='small'>{option.description}</Typography>
}

export const OptionContent = ({
  label,
  status,
  children,
  incompleteMsg,
  syncingMsg,
}: {
  label: string
  status: PrimaryNameOptionStatus
  children: React.ReactNode
  incompleteMsg: string
  syncingMsg: string
}) => {
  return (
    <div className={contentContainer}>
      <div className={labelContainer}>
        <Typography fontVariant='bodyBold' color='textSecondary'>
          {label}
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
              content={incompleteMsg}
              colorStyle='redSecondary'
            >
              Incomplete
            </TagWithTooltip>
          ))
          .with("syncing", () => (
            <TagWithTooltip
              icon={AlertSVG}
              content={syncingMsg}
              colorStyle='yellowSecondary'
            >
              Syncing
            </TagWithTooltip>
          ))
          .otherwise(() => null)}
      </div>
      {children}
    </div>
  )
}

export const OptionAddressRecordItem = ({
  status,
  value,
  onDelete,
}: {
  status: PrimaryNameOptionStatus
  value?: Address
  onDelete: () => void
}) => {
  const { copy, copied } = useCopied()
  return match(status)
    .with(P.union("none-set", "incomplete", "syncing"), () => (
      <div className={noneSet}>
        <Typography fontVariant='body' color='textSecondary'>
          None set
        </Typography>
      </div>
    ))
    .with("loading", () => <Skeleton className={loadingItem}></Skeleton>)
    .otherwise(() => (
      <div className={recordItemContainer}>
        <div
          className={recordItemContentContainer}
          onClick={() => copy(value!)}
        >
          <div className={recordItemContent}>
            <div className={recordItemText}>
              <Typography fontVariant='bodyBold' color='textPrimary'>
                {shortenAddress(value!)}
              </Typography>
              {status === "inherited" && (
                <Typography fontVariant='extraSmall' color='textSecondary'>
                  Inherited from Default
                </Typography>
              )}
            </div>
          </div>
          {copied ? (
            <CheckSVG className={recordItemIcon} />
          ) : (
            <CopySVG className={recordItemIcon} />
          )}
        </div>
        {["active", "syncing", "incomplete"].includes(status) && (
          <Button colorStyle='redSecondary' shape='square' onClick={onDelete}>
            <TrashSVG className={recordItemActionIcon} />
          </Button>
        )}
      </div>
    ))
}

export const OptionNameRecordItem = ({
  value,
  status,
  onDelete,
}: {
  value: string
  status: PrimaryNameOptionStatus
  onDelete: () => void
}) => {
  const { copy, copied } = useCopied()
  const { data: avatar } = useEnsAvatar({
    chainId: ethereum.id,
    assetGatewayUrls: {
      ipfs: "https://ipfs.euc.li",
    },
    name: value,
  })
  return match(status)
    .with(P.union("none-set", "incomplete", "syncing"), () => (
      <div className={noneSet}>
        <Typography fontVariant='body' color='textSecondary'>
          None set
        </Typography>
      </div>
    ))
    .with("loading", () => <Skeleton className={loadingItem}></Skeleton>)
    .otherwise(() => (
      <div className={recordItemContainer}>
        <div className={recordItemContentContainer} onClick={() => copy(value)}>
          <div className={recordItemContent}>
            <Avatar size='8' label={value} src={avatar || undefined} />
            <div className={recordItemText}>
              <Typography fontVariant='bodyBold' color='textPrimary'>
                {value}
              </Typography>
              {status === "inherited" && (
                <Typography fontVariant='extraSmall' color='textSecondary'>
                  Inherited from Default
                </Typography>
              )}
            </div>
          </div>
          {copied ? (
            <CheckSVG className={recordItemIcon} />
          ) : (
            <CopySVG className={recordItemIcon} />
          )}
        </div>
        {["active", "syncing", "incomplete"].includes(status) && (
          <Button colorStyle='redSecondary' shape='square' onClick={onDelete}>
            <TrashSVG className={recordItemActionIcon} />
          </Button>
        )}
      </div>
    ))
}

export const OptionSupportedChains = ({
  nameData,
  address,
}: {
  nameData?: NameData | null
  address: Address
}) => {
  const supportedChains =
    nameData?.coins
      .filter((coin) => coin.value === address)
      .map((coin) => chains.find((chain) => chain.coinType === coin.coinType))
      .filter((chain) => !!chain) || []
  return match(supportedChains.length)
    .with(0, () => <div>No supported chains</div>)
    .otherwise(() => (
      <div className={supportedChainsContainer}>
        {supportedChains.map((chain) => (
          <div key={chain.id} className={supportedChainItemContainer}>
            <img src={chain.icon} alt={chain.name} className={supportedChainItemIcon} />
            <Typography fontVariant='small' color='textPrimary'>
              {chain.name}
            </Typography>
          </div>
        ))}
      </div>
    ))
}

export const OptionAction = ({
  status,
  onClick,
}: {
  status: PrimaryNameOptionStatus
  onClick: () => void
}) => {
  return match(status)
    .with("syncing", () => (
      <Button colorStyle='accentSecondary' disabled>
        Syncing
      </Button>
    ))
    .with("loading", () => <Skeleton className={loadingItem}></Skeleton>)
    .with("fetching", () => (
      <Button colorStyle='accentSecondary' disabled>
        Updating
      </Button>
    ))
    .with("confirming", () => (
      <Button colorStyle='accentSecondary' disabled>
        Confirming
      </Button>
    ))
    .with("active", () => (
      <Button colorStyle='accentSecondary' onClick={onClick}>
        Update
      </Button>
    ))
    .with("incomplete", () => (
      <Button colorStyle='accentSecondary' onClick={onClick}>
        Update record
      </Button>
    ))
    .with(P.union("inherited", "none-set"), () => (
      <Button colorStyle='accentSecondary' onClick={onClick}>
        Set
      </Button>
    ))
    .exhaustive()
}
