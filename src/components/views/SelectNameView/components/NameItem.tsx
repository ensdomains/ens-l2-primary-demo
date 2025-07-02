import { Typography } from "@ensdomains/thorin"
import { Avatar } from "@ensdomains/thorin"
import { NameData } from "@/hooks/useNameData"
import { match, P } from "ts-pattern"
import { shortenAddress } from "@/utils/address"
import { coinContent, container, icon } from "./NameItem.css"
import { text } from "./NameItem.css"
import { content } from "./NameItem.css"
import { useEnsAvatar } from "@/hooks/useEnsAvatar"
import { PrimaryOption } from "@/constants/primaryNameOptions"
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils"

export const NameItem = ({ nameData, primaryNameOption }: { nameData: NameData, primaryNameOption: PrimaryOption }) => {
  const coin = nameData.coins.find((coin) => coin.coinType === primaryNameOption.chain.coinType)

  const { data: avatar } = useEnsAvatar({
    name: nameData.name,
  })

  return (
    <div className={container}>
      <div className={content}>
        <Avatar label='ENS' size='12' src={avatar || undefined} />
        <div className={text}>
          <Typography fontVariant='bodyBold' color='textPrimary'>
            {nameData.name}
          </Typography>
          <div className={coinContent}>
            <img src={primaryNameOption.chain.icon} alt={primaryNameOption.chain.name} className={icon}/>
            <Typography fontVariant='extraSmall' color='textSecondary'>
              {match(coin?.value).with(P.nullish, EMPTY_ADDRESS, () => `${primaryNameOption.chain.name} address is not set`)
              .otherwise((address) => shortenAddress(address!))}
          </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
