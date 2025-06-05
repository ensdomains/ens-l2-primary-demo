import { Button, Typography } from "@ensdomains/thorin"
import { useEffect, useState } from "react"
import { Connector, useAccount, useConnectors } from "wagmi"
import { connectorOptionContainer, connectorOptionImage } from "./SyncWalletView.css"

const ConnectorOptions = ({ connector, currentConnector }: { connector: Connector, currentConnector?: Connector }) => {
  const [icon, setIcon] = useState<string | null>(null)
  useEffect(() => {
    ;(async () => {
      if (connector.icon) setIcon(connector.icon)
      if (connector.rkDetails) {
        const iconUrl = await connector.rkDetails.iconUrl()
        setIcon(iconUrl)
      }
    })()
  }, [])

  const name = connector.rkDetails?.name || connector.name
  return (
    <button className={connectorOptionContainer} onClick={() => {
      console.log("current connector", currentConnector)
      currentConnector?.disconnect()
      return connector.connect()}}>
      <img className={connectorOptionImage} src={icon} alt={connector.name} />
      <Typography fontVariant='body' color='textPrimary'>
        {name}
      </Typography>
    </button>
  )
}
export const SyncWalletView = () => {
  const { connector: currecntConnectorMeta } = useAccount()
  const connectors = useConnectors()
  const currecntConnector = connectors.find((connector) => connector.id === currecntConnectorMeta?.id)

  const { address } = useAccount()

  console.log("currennt connector >>>>", currecntConnector)
  const getConnectorName = (connector: Connector) =>
    connector.rkDetails?.name || connector.name
  const uniqueFilter = (
    connector: Connector,
    index: number,
    self: Connector[],
  ) => {
    return (
      index ===
      self.findIndex((c) => getConnectorName(c) === getConnectorName(connector))
    )
  }
  const injectedConnectors = connectors
    .filter((connector) => connector.type === "injected")
    .filter(uniqueFilter)
  const otherConnectors = connectors
    .filter((connector) => connector.type !== "injected")
    .filter(uniqueFilter)

  console.log("injected connectors", injectedConnectors)
  console.log(connectors)

  return (
    <div>
      <Typography fontVariant='bodyBold' color='red'>
        Sync Wallet
      </Typography>
      <div>{address}</div>
      {injectedConnectors.map((connector) => {
        return <ConnectorOptions key={connector.id} connector={connector} currentConnector={currecntConnector} />
      })}
      <Typography fontVariant='bodyBold' color='red'>
        Popular
      </Typography>
      {otherConnectors.map((connector) => {
        return <ConnectorOptions key={connector.id} connector={connector} />
      })}
      <Button colorStyle="redSecondary" onClick={() => {
        currecntConnector?.disconnect()
      }}>
        Disconnect
      </Button>
    </div>
  )
}
