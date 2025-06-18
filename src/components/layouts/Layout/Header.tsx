import logo from "@/assets/logo.svg"
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
