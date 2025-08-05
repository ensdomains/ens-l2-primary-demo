import { PrimaryNameOptionsList } from "../../molecules/PrimaryNameOptionsList/PrimaryNameOptionsList"
import { primaryNameOptions } from "../../../constants/primaryNameOptions"
import { NameCentricPrimaryNameOption } from "./components/NameCentricPrimaryNameOption/NameCentricPrimaryNameOption"
import { TransactionDialog } from "@/components/molecules/TransactionDialog/TransactionDialog"
import { NameCentricDefaultPrimaryNameOption } from "./components/NameCentricDefaultPrimaryNameOption/NameCentricDefaultPrimaryNameOption"
import { useRegistrationStatus } from "@/hooks/useRegistrationStatus"
import { NameCentricViewBanner } from "@/components/molecules/NameCentricViewBanner"

const disabledRegistrationStatuses = ['available', 'invalid', 'unsupportedTLD', 'short', 'notOwned', 'notImported', 'offChain', 'desynced']

export const NameCentricView = ({ name }: { name: string }) => {
  const { data: registrationStatus, isLoading, isFetching } = useRegistrationStatus({ name })
  const disabled = registrationStatus && disabledRegistrationStatuses.includes(registrationStatus)
  return (
    <>
      <PrimaryNameOptionsList
        banner={
          <NameCentricViewBanner name={name} registrationStatus={registrationStatus} isLoading={isLoading || isFetching} />
        }
      >
        <PrimaryNameOptionsList.Header title={name} value={name} />
        {primaryNameOptions.map((option) => (
          <PrimaryNameOptionsList.Item key={option.id}>
            {option.id === 0 ? (
              <NameCentricDefaultPrimaryNameOption
                name={name}
                option={option}
                disabled={disabled}
              />
            ) : (
              <NameCentricPrimaryNameOption name={name} option={option} disabled={disabled} />
            )}
          </PrimaryNameOptionsList.Item>
        ))}
      </PrimaryNameOptionsList>
      <TransactionDialog />
    </>
  )
}
