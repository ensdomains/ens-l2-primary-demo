import { ChainWithMetaData, ethereum, l2Chains } from './chains';
import ensIcon from '@/assets/chain-icon/ens.svg';
import { UseSourcePrimaryNameFn } from '@/hooks/useSourcePrimaryName/useSourcePrimaryName';
import { getL1PrimaryNameSource } from '@/hooks/useSourcePrimaryName/functions/getL1PrimaryNameSource';
import { getL2PrimaryNameSource } from '@/hooks/useSourcePrimaryName/functions/getL2PrimaryNameSource';
import { Address, getChainContractAddress } from 'viem';

export type PrimaryOption = {
  id: number
  name: string
  description?: string
  chain: ChainWithMetaData
  icon: string,
  sourceQuery: UseSourcePrimaryNameFn
  reverseRegistarAddress: Address
}

export const primaryNameOptions: PrimaryOption[] = [
  {
    id: 0,
    name: "Default",
    description: "The default primary name is used on any network where you haven't set a network-specific primary name.",
    chain: ethereum,
    icon: ensIcon,
    sourceQuery: getL1PrimaryNameSource('default'),
    reverseRegistarAddress: getChainContractAddress({ chain: ethereum, contract: 'ensDefaultReverseRegistrar'})
  },
  {
    id: ethereum.id,
    name: ethereum.name,
    chain: ethereum,
    icon: ethereum.icon,
    sourceQuery: getL1PrimaryNameSource('addr'),
    reverseRegistarAddress: getChainContractAddress({ chain: ethereum, contract: 'ensReverseRegistrar'})
  },
  ...l2Chains.map(chain => ({
    id: chain.id,
    name: chain.name,
    chain,
    icon: chain.icon,
    sourceQuery: getL2PrimaryNameSource(chain.id),
    reverseRegistarAddress: getChainContractAddress({ chain, contract: 'l2ReverseRegistrar'})
  }))
]