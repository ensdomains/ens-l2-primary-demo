import { type Address } from "viem"
import { primaryNameOptions } from "../../../constants/primaryNameOptions"
import { PrimaryNameOptionsList } from "../../molecules/PrimaryNameOptionsList/PrimaryNameOptionsList"
import { shortenAddress } from "../../../utils/address"
import { TransactionDialog } from "../../molecules/TransactionDialog/TransactionDialog"
import { AddressCentricPrimaryOption } from "./components/AddressCentricPrimaryOption/AddressCentricPrimaryOption"
import { AddressCentricDefaultPrimaryOption } from "./components/AddressCentricDefaultPrimaryOption/AddressCentricDefaultPrimaryOption"

export const AddressCentricView = ({ address }: { address: Address }) => {
  return (
    <>
      <PrimaryNameOptionsList>
        <PrimaryNameOptionsList.Header
          value={address}
          title={shortenAddress(address)}
        />
        {primaryNameOptions.map((option) => (
          <PrimaryNameOptionsList.Item key={option.id}>
            {option.id === 0 ? (
              <AddressCentricDefaultPrimaryOption
                address={address}
                option={option}
              />
            ) : (
              <AddressCentricPrimaryOption address={address} option={option} />
            )}
          </PrimaryNameOptionsList.Item>
        ))}
      </PrimaryNameOptionsList>
      <TransactionDialog />
    </>
  )
}
