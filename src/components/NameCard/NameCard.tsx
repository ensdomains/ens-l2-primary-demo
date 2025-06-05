import {
  Avatar,
  Button,
  Card,
  Helper,
  AlertSVG,
  Typography,
} from "@ensdomains/thorin"
import { TagWithTooltip } from "../TagWithTooltip/TagWithTooltip"
import { recordItemContainer, recordItemLogo, chainList } from "./NameCard.css"
import { recordItemLabel, recordItemValue } from "./NameCard.css"
import { useTransactionStore } from "../../stores/transactionStore"
import { UseNameDetailsReturnType } from "../../hooks/useNameDetails"

const ChainRecord = ({
  name,
  value,
  icon,
  showError,
}: UseNameDetailsReturnType["chains"][number] & { showError: boolean }) => {
  return (
    <div className={recordItemContainer}>
      <div className={recordItemLabel}>
        <Typography fontVariant='smallBold' color='textSecondary'>
          {name}
        </Typography>
        {showError && (
          <TagWithTooltip 
          icon={AlertSVG}
          content='This has been updated to davidchu.eth. This change may take up to 6 hours to complete.'>
            Alert
          </TagWithTooltip>
        )}
      </div>
      <div className={recordItemValue}>
        <img className={recordItemLogo} src={icon} />
        <Typography fontVariant='body' color='textPrimary'>
          {value || "None set"}
        </Typography>
      </div>
    </div>
  )
}

export const NameCard = ({
  name,
  owner,
  records,
  chains,
}: UseNameDetailsReturnType) => {
  const { setView, targetAddress: walletAddress, targetChainId } = useTransactionStore()

  return (
    <Card>
      <div>
        <Avatar label='ENS' size='12' />
        <Typography fontVariant='bodyBold' color='textPrimary'>
          {name}
        </Typography>
      </div>
      <div className={chainList}>
        {chains?.map((chain) => (
          <ChainRecord
            key={chain.name}
            {...chain}
            showError={
              chain.id === targetChainId && walletAddress !== chain.value
            }
          />
        ))}
      </div>
      <Helper alert='warning' alignment='horizontal'>
        You will need to make another transaction in order to finalize
      </Helper>
      <Button onClick={() =>{
         setView({view: "set-name", name: nameDetails})
         }}>Select name</Button>
    </Card>
  )
}
