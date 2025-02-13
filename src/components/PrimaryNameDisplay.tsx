import {
  Button,
  Card,
  CardDivider,
  Heading,
  RecordItem,
  Tag,
  Typography,
} from "@ensdomains/thorin";
import { match } from "ts-pattern";
import { type Address, getChainContractAddress } from "viem";
import { useAccount, useConfig } from "wagmi";
import { usePrimaryName } from "../hooks/usePrimaryName";
import { useSyncName } from "../hooks/useSyncName";
import type { L1Chain, SupportedChain } from "../wagmi";

const IndividualChainDisplay = ({
  chain,
  l1Chain,
  address,
}: {
  chain: SupportedChain;
  l1Chain: L1Chain;
  address: Address;
}) => {
  const isL2 = !!chain.sourceId;

  const { data: primaryName } = usePrimaryName({ address, chainId: chain.id });
  const { data: l1PrimaryName } = usePrimaryName({
    address,
    chainId: chain.sourceId,
    directQuery: true,
    enabled: isL2,
  });
  const { data: l2OrDefaultPrimaryName } = usePrimaryName({
    address,
    chainId: chain.id,
    directQuery: true,
    forceDefault: !isL2,
  });

  const { status, prepare, execute, switchChain } = useSyncName({
    targetChain: chain,
    targetAddress: getChainContractAddress({
      chain,
      contract: "l2ReverseRegistrar",
    }),
    ...(isL2
      ? {
          chainId: chain.id,
        }
      : {
          ns: "default",
        }),
  });

  const [buttonDisabled, buttonText] = (() => {
    if (l2OrDefaultPrimaryName === l1PrimaryName)
      return [
        true,
        primaryName !== l2OrDefaultPrimaryName ? "Syncing" : "Already synced",
      ];
    if (isL2) return [false, `Sync to ${l1Chain.name} value`];
    return [false, "Sync default value"];
  })();

  const transactionButton = match(status)
    .with(null, () => (
      <Button size="small" disabled={buttonDisabled} onClick={prepare}>
        {buttonText}
      </Button>
    ))
    .with("preparing", () => (
      <Button size="small" disabled>
        Preparing
      </Button>
    ))
    .with("switchChain", () => (
      <Button size="small" onClick={switchChain}>
        Switch chain
      </Button>
    ))
    .with("prepared", () => (
      <Button size="small" onClick={execute}>
        Sync
      </Button>
    ))
    .with("confirmInWallet", () => (
      <Button size="small" disabled>
        Confirm in wallet
      </Button>
    ))
    .with("sent", () => (
      <Button size="small" disabled>
        Sent
      </Button>
    ))
    .with("confirmed", () => (
      <Button size="small" disabled>
        Confirmed
      </Button>
    ))
    .exhaustive();

  return (
    <Card className="chain-item">
      <div className="title">
        <img src={chain.icon} alt={chain.name} />
        <Typography fontVariant="headingFour">{chain.name}</Typography>
      </div>
      <div className="tags">
        {chain.tags.map(([content, color]) => (
          <Tag key={content} colorStyle={`${color}Secondary`}>
            {content}
          </Tag>
        ))}
      </div>
      <div className="values">
        <div className="value">
          <Typography>L1 value</Typography>
          {primaryName ? (
            <RecordItem value={primaryName}>{primaryName}</RecordItem>
          ) : (
            <Typography
              className="no-value"
              fontVariant="bodyBold"
              color="textDisabled"
            >
              No primary name
            </Typography>
          )}
        </div>
        <div className="value">
          <Typography>{isL2 ? "L2 value" : "Default value"}</Typography>
          {l2OrDefaultPrimaryName ? (
            <RecordItem value={l2OrDefaultPrimaryName}>
              {l2OrDefaultPrimaryName}
            </RecordItem>
          ) : (
            <Typography
              className="no-value"
              fontVariant="bodyBold"
              color="textDisabled"
            >
              No primary name
            </Typography>
          )}
        </div>
      </div>
      <CardDivider />
      <div className="buttons">{transactionButton}</div>
    </Card>
  );
};

export const PrimaryNameDisplay = () => {
  const { address } = useAccount();
  const config = useConfig();

  const currentChainId = config.state.chainId;
  const currentChain = config.chains.find((c) => c.id === currentChainId);
  const l1Chain = (
    currentChain?.sourceId
      ? config.chains.find((c) => c.id === currentChain?.sourceId)
      : currentChain
  ) as L1Chain;

  return (
    <div className="primary-name-display">
      {address ? (
        config.chains.map((c) => (
          <IndividualChainDisplay
            key={c.id}
            chain={c}
            l1Chain={l1Chain}
            address={address}
          />
        ))
      ) : (
        <Heading level="1">
          Connect your wallet to view L2 primary names
        </Heading>
      )}
    </div>
  );
};
