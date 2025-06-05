import { useParams } from "react-router"
import { mainView, optionItem } from "./MainView.css"
import { Button, Card, Dialog, Input } from "@ensdomains/thorin"
import { primaryNameOptions, PrimaryOption } from "../../../primaryOptions"
import { useNameData } from "../../../hooks/useNameData"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Address } from "viem"
import { TransactionDialog } from "../../TransactionDialog/TransactionDialog"

const PrimaryOptionItem = (option: PrimaryOption) => {
  return <div className={optionItem}>
    <div>{option.name}</div>
    <Button colorStyle="accentSecondary">
    Set
    </Button>
    </div>
}

export const MainView = () => {

  const { openConnectModal } = useConnectModal()
  const { name } = useParams()
  const { data } = useNameData({
    name: name as string,
  })
  const [targetAddress, setTargetAddress] = useState<Address | undefined>(undefined)

  const { address } = useAccount()
  useEffect(() => {
    setTargetAddress(address)
  }, [address])


  return (
    <>
    <Card>
      <div className={mainView}>
        <div className='header'>{name}</div>
        <div className='content'>
          {data?.chains.map((chain) => <div>{chain.name}</div>)}
          {primaryNameOptions.map((option) => (
            <PrimaryOptionItem key={option.id} {...option} />
          ))}
        </div>
      </div>
    </Card>
    {/* <TransactionDialog /> */}
    </>
  )
}
