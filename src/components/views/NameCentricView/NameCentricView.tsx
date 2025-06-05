import { PrimaryNameOptionsList } from "../../PrimaryNameOptionsList/PrimaryNameOptionsList"
import { primaryNameOptions } from "../../../primaryOptions"

export const NameCentricView = ({ name} : { name: string}) => {
  return <PrimaryNameOptionsList>
    <PrimaryNameOptionsList.Header label="Setting Primary Names for" title={name} />
    {primaryNameOptions.map((option) => <PrimaryNameOptionsList.Item key={option.id}>
      {option.name}
    </PrimaryNameOptionsList.Item>)}
  </PrimaryNameOptionsList>
}