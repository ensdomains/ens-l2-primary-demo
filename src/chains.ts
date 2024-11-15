import { type Chain, fallback } from "viem";
import {
  arbitrumSepolia as arbitrumSepoliaViem,
  baseSepolia as baseSepoliaViem,
  lineaSepolia as lineaSepoliaViem,
  optimismSepolia as optimismSepoliaViem,
  scrollSepolia as scrollSepoliaViem,
  sepolia as sepoliaViem,
} from "viem/chains";
import { http } from "wagmi";

import type { Color } from "@ensdomains/thorin";
import arbitrumIcon from "./assets/chain-icon/arbitrum.svg";
import baseIcon from "./assets/chain-icon/base.svg";
import ethereumIcon from "./assets/chain-icon/ethereum.svg";
import lineaIcon from "./assets/chain-icon/linea.svg";
import optimismIcon from "./assets/chain-icon/optimism.svg";
import scrollIcon from "./assets/chain-icon/scroll.svg";

type ChainRpcDetails = {
  url: string;
  ankr?: string;
  infura?: string;
  alchemy?: string;
};
type ChainWithDetails = Chain & {
  rpc: ChainRpcDetails;
  icon: string;
  iconUrl?: () => Promise<string>;
  iconBackground?: string;
  tags: [string, Color][];
};

const apiKeys = {
  alchemy: "GCuqAN_JwFx5WQ9B70-of6FlQpUbecBw",
  ankr: "cc4f51973be04739743bf347bbafe81389e6aef743379bb6d9eb39cac4d4ba48",
  infura: "fb056f5f6e304fd59aa054196f601d3a",
};

export const constructTransport = (details: ChainRpcDetails) => {
  return fallback([
    ...("alchemy" in details
      ? [http(`https://${details.alchemy}.g.alchemy.com/v2/${apiKeys.alchemy}`)]
      : []),
    ...("ankr" in details
      ? [http(`https://rpc.ankr.com/${details.ankr}/${apiKeys.ankr}`)]
      : []),
    ...("infura" in details
      ? [http(`https://${details.infura}.infura.io/v3/${apiKeys.infura}`)]
      : []),
    http(details.url),
  ]);
};

export const sepolia = {
  ...sepoliaViem,
  sourceId: undefined,
  contracts: {
    ...sepoliaViem.contracts,
    l2ReverseResolver: {
      // this is actually the default reverse resolver but just for convenience
      address: "0xB5cd6c346D7084d69B9e9ADbe3f7e4C6ab714c4c",
    },
  },
  rpc: {
    url: "https://rpc.ankr.com/eth_sepolia/",
    ankr: "eth_sepolia",
    infura: "sepolia",
    alchemy: "eth-sepolia",
  },
  icon: ethereumIcon,
  tags: [["L1", "blue"]],
} as const satisfies ChainWithDetails;

export const baseSepolia = {
  ...baseSepoliaViem,
  contracts: {
    ...baseSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0x004507C664E56c5Ee12Da7dBebF84E7c44ebF311",
    },
    l2ReverseResolver: {
      address: "0xa12159e5131b1eEf6B4857EEE3e1954744b5033A",
    },
  },
  rpc: {
    url: "https://sepolia.base.org",
    ankr: "base_sepolia",
    infura: "base-sepolia",
    alchemy: "base-sepolia",
  },
  icon: baseIcon,
  tags: [
    ["2hr sync", "purple"],
    ["Safe unfinalised", "orange"],
  ],
} as const satisfies ChainWithDetails;

export const optimismSepolia = {
  ...optimismSepoliaViem,
  contracts: {
    ...optimismSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0xCd19833F5c9402cd3BCc19c994E49e5A61bF0281",
    },
    l2ReverseResolver: {
      address: "0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376",
    },
  },
  rpc: {
    url: "https://sepolia.optimism.io",
    ankr: "optimism_sepolia",
    infura: "optimism-sepolia",
    alchemy: "opt-sepolia",
  },
  icon: optimismIcon,
  tags: [
    ["2hr sync", "purple"],
    ["Safe unfinalised", "orange"],
  ],
} as const satisfies ChainWithDetails;

export const arbitrumSepolia = {
  ...arbitrumSepoliaViem,
  sourceId: sepolia.id,
  contracts: {
    ...arbitrumSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0xfdf96b25c1D26f07e6957BEFA9EF7Afe51c43BFe",
    },
    l2ReverseResolver: {
      address: "0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376",
    },
  },
  rpc: {
    url: "https://sepolia-rollup.arbitrum.io/rpc",
    ankr: "arbitrum_sepolia",
    infura: "arbitrum-sepolia",
    alchemy: "arb-sepolia",
  },
  icon: arbitrumIcon,
  tags: [
    ["1hr sync", "purple"],
    ["Safe unfinalised", "orange"],
  ],
} as const satisfies ChainWithDetails;

export const scrollSepolia = {
  ...scrollSepoliaViem,
  sourceId: sepolia.id,
  contracts: {
    ...scrollSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0x71D9BCc0C53faC3bF5345770D347c7b4b8896acF",
    },
    l2ReverseResolver: {
      address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
    },
  },
  rpc: {
    url: "https://sepolia-rpc.scroll.io",
    ankr: "scroll_sepolia_testnet",
  },
  icon: scrollIcon,
  iconUrl: async () => scrollIcon,
  iconBackground: "#FFEEDA",
  tags: [
    ["1hr sync", "purple"],
    ["Finalised", "green"],
  ],
} as const satisfies ChainWithDetails;

export const lineaSepolia = {
  ...lineaSepoliaViem,
  sourceId: sepolia.id,
  contracts: {
    ...lineaSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0xe6152Ec76d027cf4824Fa6950500568D3C7a0CE8",
    },
    l2ReverseResolver: {
      address: "0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376",
    },
  },
  rpc: {
    url: "https://rpc.sepolia.linea.build",
    infura: "linea-sepolia",
    alchemy: "linea-sepolia",
  },
  icon: lineaIcon,
  iconUrl: async () => lineaIcon,
  iconBackground: "#61DFFF",
  tags: [
    ["8-24hr sync", "purple"],
    ["Finalised", "green"],
  ],
} as const satisfies ChainWithDetails;
