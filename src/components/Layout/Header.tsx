import logo from "../../assets/logo.svg"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletConnectButton } from "../WalletConnectButton";
import { useTransactionStore } from "../../stores/transactionStore";
import { header } from "./Header.css";
export const Header = () => {
  const { setView } = useTransactionStore()
  return (
    <div className={header}>
      <img src={logo} alt="logo" />
      <WalletConnectButton/>
    </div>
  );
};
