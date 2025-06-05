import { useAccount } from "wagmi"
import { Header } from "./components/Layout/Header"
import { PrimaryNameDisplay } from "./components/PrimaryNameDisplay"
import { useTransactionStore } from "./stores/transactionStore"
import { match } from "ts-pattern"
import { SelectNameView } from "./views/select-name/SelectNameView"
import { SetNameView } from "./views/set-name/SetNameView"
import { AddressCentricView as MainView2 } from "./components/views/AddressCentricView/AddressCentricView"
import { MainView } from "./components/pages/MainView/MainView"

function App() {
  const account = useAccount()

  const { view } = useTransactionStore()

  console.log("account", account)

  return (
    <div className='container'>
      <div className='layout'>
        <Header />
        {match(view)
        .with('select-name', () => 
        <SelectNameView/>)
        .with('set-name', () => 
        <SetNameView/>)
        .otherwise(() => (
          <MainView />
        ))}
      </div>
    </div>
  )
}

export default App
