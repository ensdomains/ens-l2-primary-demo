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
import type { ReverseNodeOptions } from "../utils/name";
import type { SupportedChain } from "../wagmi";
import { usePrimaryName } from "./usePrimaryName";

const setNameAbi = parseAbi(["function setName(string memory name)"]);

export const useSyncName = ({
  targetChain,
  targetAddress,
}: {
  targetChain: SupportedChain;
  targetAddress: Address;
} & ReverseNodeOptions) => {
  const queryClient = useQueryClient();
  const { address, chainId: connectedChainId } = useAccount();

  const { data: syncValue } = usePrimaryName({
    address,
    chainId: targetChain.sourceId ?? targetChain.id,
  });

  const encodedData = syncValue
    ? encodeFunctionData({
        abi: setNameAbi,
        args: [syncValue],
      })
    : undefined;
  const {
    data: preparedRequest,
    isLoading: isPrepareLoading,
    refetch,
  } = usePrepareTransactionRequest({
    to: targetAddress,
    chainId: targetChain.id,
    data: encodedData,
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
  } = useSendTransaction();

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash,
    chainId: targetChain.id,
  });

  const prepare = () => {
    queryClient.resetQueries({
      queryKey: ["prepareTransactionRequest"],
      exact: false,
    });
    refetch();
  };
  const execute = () =>
    sendTransaction({ ...preparedRequest, to: targetAddress });

  const status = useMemo(() => {
    if (transactionReceipt) return "confirmed" as const;
    if (isSuccess) return "sent" as const;
    if (isPending) return "confirmInWallet" as const;
    if (isPrepareLoading) return "preparing" as const;
    if (preparedRequest) {
      if (connectedChainId !== targetChain.id) return "switchChain" as const;
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
    targetChain.id,
  ]);

  return {
    status,
    prepare,
    execute,
    switchChain: () => switchChain({ chainId: targetChain.id }),
  };
};
