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
  drpc?: string;
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
  drpc: "AjKib_55JEmzihaZhIxhyNb_ffsW8IMR7oQ98qIilXTF",
};

export const constructTransport = (details: ChainRpcDetails) => {
  return fallback([
    ...("drpc" in details
      ? [
          http(
            `https://lb.drpc.org/ogrpc?network=${details.drpc}&dkey=${apiKeys.drpc}`
          ),
        ]
      : []),
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
    l2ReverseRegistrar: {
      // this is actually the default reverse resolver but just for convenience
      address: "0x089C3F89e6eE8bAc40aFA96267a1c84003109d1b",
    },
    ensNameWrapper: {
      address: "0x0635513f179D50A207757E05759CbD106d7dFcE8",
    },
    ensBaseRegistrarImplementation: {
      address: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    },
  },
  rpc: {
    url: "https://rpc.ankr.com/eth_sepolia/",
    ankr: "eth_sepolia",
    infura: "sepolia",
    alchemy: "eth-sepolia",
    drpc: "sepolia",
  },
  icon: ethereumIcon,
  tags: [["L1", "blue"]],
} as const satisfies ChainWithDetails;

export const baseSepolia = {
  ...baseSepoliaViem,
  contracts: {
    ...baseSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0x490F21cA7294Db7489b98A251D029E83a17A7262",
    },
    l2ReverseRegistrar: {
      address: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
    },
  },
  rpc: {
    url: "https://sepolia.base.org",
    ankr: "base_sepolia",
    infura: "base-sepolia",
    alchemy: "base-sepolia",
    drpc: "base-sepolia",
  },
  icon: baseIcon,
  tags: [
    ["6hr sync", "purple"],
    ["Safe unfinalised", "orange"],
  ],
} as const satisfies ChainWithDetails;

export const optimismSepolia = {
  ...optimismSepoliaViem,
  contracts: {
    ...optimismSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0xD8af9130D2A770B53A20EEbC40377D097f3EFc19",
    },
    l2ReverseRegistrar: {
      address: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
    },
  },
  rpc: {
    url: "https://sepolia.optimism.io",
    ankr: "optimism_sepolia",
    infura: "optimism-sepolia",
    alchemy: "opt-sepolia",
    drpc: "optimism-sepolia",
  },
  icon: optimismIcon,
  tags: [
    ["6hr sync", "purple"],
    ["Safe unfinalised", "orange"],
  ],
} as const satisfies ChainWithDetails;

export const arbitrumSepolia = {
  ...arbitrumSepoliaViem,
  sourceId: sepolia.id,
  contracts: { 
    ...arbitrumSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0x5Fec74B711EdE9828eddfb7A0370BD28D075fdeF",
    },
    l2ReverseRegistrar: {
      address: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
    },
  },
  rpc: {
    url: "https://sepolia-rollup.arbitrum.io/rpc",
    ankr: "arbitrum_sepolia",
    infura: "arbitrum-sepolia",
    alchemy: "arb-sepolia",
    drpc: "arbitrum-sepolia",
  },
  icon: arbitrumIcon,
  tags: [
    ["6hr sync", "purple"],
    ["Safe unfinalised", "orange"],
  ],
} as const satisfies ChainWithDetails;

export const scrollSepolia = {
  ...scrollSepoliaViem,
  sourceId: sepolia.id,
  contracts: {
    ...scrollSepoliaViem.contracts,
    l1ReverseResolver: {
      address: "0xDf756B18878da8229e4e741A467b4432dde0601A",
    },
    l2ReverseRegistrar: {
      address: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
    },
  },
  rpc: {
    url: "https://sepolia-rpc.scroll.io",
    ankr: "scroll_sepolia_testnet",
    drpc: "scroll-sepolia",
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
      address: "0x65Fd0B7576027fDF1EE49dA5099D9bCb305710e5",
    },
    l2ReverseRegistrar: {
      address: "0x00000BeEF055f7934784D6d81b6BC86665630dbA",
    },
  },
  rpc: {
    url: "https://rpc.sepolia.linea.build",
    infura: "linea-sepolia",
    alchemy: "linea-sepolia",
    drpc: "linea-sepolia",
  },
  icon: lineaIcon,
  iconUrl: async () => lineaIcon,
  iconBackground: "#61DFFF",
  tags: [
    ["8-24hr sync", "purple"],
    ["Finalised", "green"],
  ],
} as const satisfies ChainWithDetails;
