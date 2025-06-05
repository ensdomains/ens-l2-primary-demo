import {
  Typography,
  CopySVG,
  CheckSVG,
  Avatar,
  Button,
  TrashSVG,
  AlertSVG,
  CheckCircleSVG,
} from "@ensdomains/thorin"
import { Skeleton } from "../Skeleton/Skeleton"
import {
  contentContainer,
  labelContainer,
  loadingItem,
  noneSet,
  recordItemContentContainer,
  recordItemContent,
  recordItemIcon,
  recordItemText,
  recordItemContainer,
  recordItemActionIcon,
} from "./ChainCardContent.css"
import { useCopied } from "../../hooks/useCopied"
import { useEnsAvatar } from "wagmi"
import { TagWithTooltip } from "../TagWithTooltip/TagWithTooltip"
import { ethereum } from "../../chains2"
import { match, P } from "ts-pattern"
import { NameStatus } from "./ChainCard"
import { TagWithIcon } from "../TagWithIcon/TagWithIcon"

export const NoneSet = () => (
  <div className={noneSet}>
    <Typography fontVariant='body' color='textSecondary'>
      None set
    </Typography>
  </div>
)

export const LoadingItem = () => {
  return <Skeleton className={loadingItem} />
}

export const RecordItem = ({
  value,
  inherited,
}: {
  value: string
  inherited: boolean
}) => {
  const { copy, copied } = useCopied()
  const { data: avatar } = useEnsAvatar({
    chainId: ethereum.id,
    assetGatewayUrls: {
      ipfs: "https://ipfs.euc.li",
    },
    name: value,
  })
  return (
    <div className={recordItemContainer} onClick={() => copy(value)}>
      <div className={recordItemContentContainer}>
        <div className={recordItemContent}>
          <Avatar size='8' label={value} src={avatar || undefined} />
          <div className={recordItemText}>
            <Typography fontVariant='bodyBold' color='textPrimary'>
              {value}
            </Typography>
            {inherited && (
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
      <Button colorStyle='redSecondary' shape='square'>
        <TrashSVG className={recordItemActionIcon} />
      </Button>
    </div>
  )
}

export const ChainCardContent = ({
  chainName,
  status,
  resolvedValue,
  sourceValue,
  syncTime,
}: {
  chainName: string
  status: NameStatus
  resolvedValue?: string
  sourceValue?: string
  syncTime: string
}) => {
  return (
    <>
      <div className={contentContainer}>
        <div className={labelContainer}>
          <Typography fontVariant='bodyBold' color='textSecondary'>
            Primary name
          </Typography>
          {match(status)
            .with(P.union("active", "inherited"), () => <TagWithIcon icon={CheckCircleSVG} colorStyle="greenSecondary" size="small">
              Active</TagWithIcon>)
            .with("incomplete", () => (
              <TagWithTooltip icon={AlertSVG} content={`To use ${sourceValue} as your Primary Name you musth update the ${chainName} record`} colorStyle="redSecondary">
                Incomplete
              </TagWithTooltip>
            ))
            .with("syncing", () => (
              <TagWithTooltip icon={AlertSVG} content={`This has been updated to ${sourceValue}. This change may take up to ${syncTime} to complete.`} colorStyle="yellowSecondary">
                Syncing
              </TagWithTooltip>
            ))
            .otherwise(() => null)}
        </div>
        {match(status)
          .with("none-set", () => <NoneSet />)
          .with("loading", () => <LoadingItem />)
          .otherwise(() => (
            <RecordItem value={resolvedValue} inherited={status === "inherited"} />
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
          <Button colorStyle='accentSecondary'>Set</Button>
        ))
        .exhaustive()}
    </>
  )
}
