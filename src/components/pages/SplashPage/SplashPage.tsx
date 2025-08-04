import { Input, MagnifyingGlassSVG, Typography } from "@ensdomains/thorin"
import { card, chainIcon, chainIcons, splashPage } from "./SplashPage.css"
import { chains } from "@/constants/chains"
import { useNavigate } from "react-router"
import { isAddress } from "viem"
import { normalizeName } from "../IdentifierPage"

export const SplashPage = () => {
  const navigate = useNavigate()
  return (
    <div className={splashPage}>
      <Typography fontVariant='headingOne' textAlign='center'>
        L2 Primary Name
      </Typography>
      <div className={card}>
        <Typography textAlign='center'>
          Primary Names link your address to a name, allowing apps to display a
          name and profile when looking up this address. Each address can have a
          different Primary Name for all supported chains, or a default.
        </Typography>
        <div className={chainIcons}>
          {chains.map((chain) => <img key={chain.name} src={chain.icon} alt={chain.name} className={chainIcon} />)}
          </div>
          <Input label="" placeholder="Search for a name or address" icon={<MagnifyingGlassSVG/>} onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (isAddress(e.currentTarget.value)) {
            navigate(`/${e.currentTarget.value}`)
          } else {
            navigate(`/${normalizeName(e.currentTarget.value)}`)
          }
        }
      }}/>
      </div>
    </div>
  )
}
