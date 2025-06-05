import { Typography } from "@ensdomains/thorin"
import { Avatar } from "@ensdomains/thorin"
import { NameData } from "../../hooks/useNameData"
import { chains, ethereum } from "../../chains2"
import { match, P } from "ts-pattern"
import { shortenAddress } from "../../utils/address"
import { coinContent, container, icon } from "./NameItem.css"
import { text } from "./NameItem.css"
import { content } from "./NameItem.css"
import { useEnsAvatar } from "wagmi"

export const NameItem = ({
  name,
  coins,
  targetChainId,
}: NameData & { targetChainId: number }) => {
  const chain = chains.find((chain) => chain.id === targetChainId)
  const coin = coins.find((coin) => coin.id === targetChainId)

  const { data: avatar } = useEnsAvatar({
    chainId: ethereum.id,
    assetGatewayUrls: {
      ipfs: "https://ipfs.euc.li",
    },
    name: name,
  })

  return (
    <div className={container}>
      <div className={content}>
        <Avatar label='ENS' size='12' src={avatar || undefined} />
        <div className={text}>
          <Typography fontVariant='bodyBold' color='textPrimary'>
            {name}
          </Typography>
          <div className={coinContent}>
            <img src={chain?.icon} alt={chain?.name} className={icon}/>
            <Typography fontVariant='extraSmall' color='textSecondary'>
              {match(coin?.value).with(P.nullish, () => `${chain.name} address is not set`)
              .otherwise((address) => shortenAddress(address!))}
          </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
