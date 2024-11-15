import { EnsSVG, Heading } from "@ensdomains/thorin";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <EnsSVG />
        <Heading>L2 Primary Names</Heading>
      </div>
      <ConnectButton />
    </div>
  );
};
