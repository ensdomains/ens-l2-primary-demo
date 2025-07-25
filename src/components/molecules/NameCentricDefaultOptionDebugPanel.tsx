import { NameData } from "@/hooks/useNameData"
import { Typography } from "@ensdomains/thorin"
import { MagicDevPanel } from "../atoms/MagicDevPanel"
import { Divider } from "../atoms/Divider/Divider"
import { shortenAddress } from "@/utils/address"
import { chains } from "@/constants/chains"

export const NameCentricDefaultOptionDebugPanel = ({
  names,
  nameData,
}: {
  names: { name: string, address: string }[]
  nameData?: NameData | null
}) => {
  return <MagicDevPanel>
    <div>
      <div>
        <Typography fontVariant='smallBold' color='grey'>Unique known addresses</Typography>
      </div>
      { names.map(({ name, address }) => (
        <div key={address}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Typography fontVariant='extraSmall' color='grey'>address:</Typography>
            <Typography fontVariant='extraSmall'>{address}</Typography>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Typography fontVariant='extraSmall' color='grey'>default name for {shortenAddress(address)}:</Typography>
            <Typography fontVariant='extraSmall'>{name}</Typography>
          </div>
          <Divider/>
        </div>
      ))}
      <div>
        <Typography fontVariant='smallBold' color='grey'>Address records for {nameData?.name}</Typography>
      </div>
      { nameData?.coins.map((coin) => (
        <div key={coin.id} style={{ display: 'flex', gap: '10px' }}>
          <Typography fontVariant='extraSmall' color='grey'>{chains.find(chain => chain.coinType === coin.coinType)?.name} ({coin.coinType}):</Typography>
          <Typography fontVariant='extraSmall'>{coin.value}</Typography>
        </div>
      ))}
    </div>
  </MagicDevPanel>
}