import { Typography } from "@ensdomains/thorin"
import { card, chainIcon, chainIcons, splashPage } from "./SplashPage.css"
import { chains } from "@/constants/chains"
import { SearchInput } from "@/components/molecules/SearchInput"

export const SplashPage = () => {
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
          <SearchInput />
      </div>
    </div>
  )
}
