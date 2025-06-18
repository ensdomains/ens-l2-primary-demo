import logo from "@/assets/logo.svg"
import { WalletConnectButton } from "../../atoms/WalletConnectButton";
import { header } from "./Header.css";
export const Header = () => {
  return (
    <div className={header}>
      <img src={logo} alt="logo" />
      <WalletConnectButton/>
    </div>
  );
};
