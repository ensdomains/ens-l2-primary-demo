import logo from "@/assets/logo.svg"
import { WalletConnectButton } from "../../atoms/WalletConnectButton"
import { header } from "./Header.css"
import { Link } from "react-router"

export const Header = () => {
  return (
    <div className={header}>
      <Link to='/'>
        <img src={logo} alt='logo' />
      </Link>
      <WalletConnectButton />
    </div>
  )
}
