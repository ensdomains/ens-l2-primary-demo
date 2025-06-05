import { Tag, Typography } from "@ensdomains/thorin"
import { container, title } from './ChainCardHeader.css'
import { PrimaryOption } from "../../primaryOptions"

export const ChainCardHeader = ({ icon, name, chain }: PrimaryOption) => {
  return <div className={container}>
    <div className={title}>
      <img src={icon} alt={name} className={icon} />
    <Typography fontVariant="largeBold">
      {name}
    </Typography>      
    </div>
    <div>
      { chain.syncTime && <Tag colorStyle="blueSecondary">{chain.syncTime} sync</Tag>}
    </div>
  </div>
}