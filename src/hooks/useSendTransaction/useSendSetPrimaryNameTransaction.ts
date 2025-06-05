import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { type Address, encodeFunctionData, parseAbi } from "viem";
import {
  useAccount,
  usePrepareTransactionRequest,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { ReverseNodeOptions } from "../../utils/name";
import { primaryNameOptions } from "../../primaryOptions";

const setNameAbi = parseAbi(["function setName(string memory name)"]);

export const useSendSetPrimaryNameTransaction = ({
  primaryNameOptionId,
  name,
}: {
  name: string;
  primaryNameOptionId: number
} & ReverseNodeOptions) => {

  const primaryNameOption = primaryNameOptions.find(p => p.id === primaryNameOptionId)
  const reverseRegistarAddress = primaryNameOption?.reverseRegistarAddress

  console.log('primaryNameOption', primaryNameOption)
  console.log('reverseRegistarAddress', reverseRegistarAddress)

  const queryClient = useQueryClient();

  const { address, chainId: connectedChainId } = useAccount();

  const encodedData = name
    ? encodeFunctionData({
        abi: setNameAbi,
        args: [name],
      })
    : undefined;

  const {
    data: preparedRequest,
    isLoading: isPrepareLoading,
    refetch,
  } = usePrepareTransactionRequest({
    to: reverseRegistarAddress,
    chainId: primaryNameOption?.chain.id,
    data: encodeFunctionData({
      abi: setNameAbi,
      args: [name],
    }),
    query: {
      enabled: false,
    },
  });

  const { switchChain } = useSwitchChain();

  const {
    sendTransaction,
    isPending,
    isSuccess,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess: (data: any) => {
        console.log("success", data)
      }
    }
  });

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash,
    chainId: primaryNameOption?.chain.id,
  });

  const prepare = () => {
    queryClient.resetQueries({
      queryKey: ["prepareTransactionRequest"],
      exact: false,
    });
    refetch();
  };
  const execute = () =>
    sendTransaction({ ...preparedRequest, to: primaryNameOption?.reverseRegistarAddress });

  const status = useMemo(() => {
    if (transactionReceipt) return "confirmed" as const;
    if (isSuccess) return "sent" as const;
    if (isPending) return "confirmInWallet" as const;
    if (isPrepareLoading) return "preparing" as const;  
    if (preparedRequest) {
      if (connectedChainId !== primaryNameOption?.chain.id) return "switchChain" as const;
      return "prepared" as const;
    }
    return null;
  }, [
    isPrepareLoading,
    isPending,
    isSuccess,
    transactionReceipt,
    preparedRequest,
    connectedChainId,
    primaryNameOption?.chain.id,
  ]);

  return {
    status,
    prepare,
    execute,
    switchChain: () => switchChain({ chainId: primaryNameOption?.chain.id }),
  };
};
