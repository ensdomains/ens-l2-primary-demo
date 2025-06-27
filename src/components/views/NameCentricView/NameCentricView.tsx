import { PrimaryNameOptionsList } from "../../molecules/PrimaryNameOptionsList/PrimaryNameOptionsList"
import { primaryNameOptions } from "../../../constants/primaryNameOptions"
import { NameCentricPrimaryNameOption } from "./components/NameCentricPrimaryNameOption/NameCentricPrimaryNameOption"
import { TransactionDialog } from "@/components/molecules/TransactionDialog/TransactionDialog"
import { NameCentricDefaultPrimaryNameOption } from "./components/NameCentricDefaultPrimaryNameOption/NameCentricDefaultPrimaryNameOption"

export const NameCentricView = ({ name }: { name: string }) => {
  return (
    <>
      <PrimaryNameOptionsList>
        <PrimaryNameOptionsList.Header title={name} value={name} />
        {primaryNameOptions.map((option) => (
          <PrimaryNameOptionsList.Item key={option.id}>
            {option.id === 0 ? (
              <NameCentricDefaultPrimaryNameOption
                name={name}
                option={option}
              />
            ) : (
              <NameCentricPrimaryNameOption name={name} option={option} />
            )}
          </PrimaryNameOptionsList.Item>
        ))}
      </PrimaryNameOptionsList>
      <TransactionDialog />
    </>
  )
}
