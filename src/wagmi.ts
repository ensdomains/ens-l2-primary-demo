import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrumSepolia,
  baseSepolia,
  constructTransport,
  lineaSepolia,
  optimismSepolia,
  scrollSepolia,
  sepolia,
} from "./chains";

import { chains } from "./chains2";

export const config_ = getDefaultConfig({
  appName: "ENS L2 Primary Demo",
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains,
  transports: {
    [sepolia.id]: constructTransport(sepolia.rpc),
    [baseSepolia.id]: constructTransport(baseSepolia.rpc),
    [optimismSepolia.id]: constructTransport(optimismSepolia.rpc),
    [arbitrumSepolia.id]: constructTransport(arbitrumSepolia.rpc),
    [scrollSepolia.id]: constructTransport(scrollSepolia.rpc),
    [lineaSepolia.id]: constructTransport(lineaSepolia.rpc),
  },
});

export type SupportedChain = (typeof config_.chains)[number];
export type L1Chain = Extract<SupportedChain, { sourceId: undefined }>;

export const wagmiConfig = config_ as typeof config_ & {
  _isEns: true;
};

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
