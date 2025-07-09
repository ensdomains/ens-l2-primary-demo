import { chains, ChainWithDetails } from "@/constants/chains"
import {
  container,
  iconContainer,
  label,
  iconVariant,
  chainOptionVariant,
} from "./SelectChainsComponent.css"
import { Typography } from "@ensdomains/thorin"
import { match } from "ts-pattern"

const ChainOption = ({
  chain,
  selected,
  disabled,
  onClick,
}: {
  chain: ChainWithDetails
  selected: boolean
  disabled: boolean
  onClick: () => void
}) => {
  const variant = match({ selected, disabled})
  .with({ selected: true, disabled: false }, () => "checked" as const)
  .with({ selected: false, disabled: false }, () => "unchecked" as const)
  .with({ selected: false, disabled: true }, () => "uncheckedDisabled" as const)
  .with({ selected: true, disabled: true }, () => "checkedDisabled" as const)
  .exhaustive()

  return (
    <div className={chainOptionVariant[variant]} onClick={onClick}>
      <div className={label}>
        <div className={iconContainer}>
          <img
            className={iconVariant[variant]}
            src={chain.icon}
            alt={chain.name}
          />
        </div>
        <Typography fontVariant='bodyBold' color={disabled ? "grey" : "text"}>
          {chain.name}
        </Typography>
      </div>
    </div>
  )
}

export const SelectChainsComponent = ({
  selectedCoinTypes = [],
  previousCoinTypes = [],
  onChange,
}: {
  selectedCoinTypes: number[]
  previousCoinTypes: number[]
  onChange: (coinType: number, selected: boolean) => void
}) => {
  return (
    <div className={container}>
      {chains.map((chain) => (
        <ChainOption
          key={chain.id}
          chain={chain}
          disabled={previousCoinTypes.includes(chain.coinType)}
          selected={selectedCoinTypes.includes(chain.coinType) || previousCoinTypes.includes(chain.coinType)}
          onClick={() => {
            if (previousCoinTypes.includes(chain.coinType)) return
            onChange(
              chain.coinType,
              !selectedCoinTypes.includes(chain.coinType),
            )
          }}
        />
      ))}
    </div>
  )
}
