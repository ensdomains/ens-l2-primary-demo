import { Button, CheckSVG, CopySVG, Input, OutlinkSVG, Typography, MagnifyingGlassSVG } from "@ensdomains/thorin"
import {
  container,
  header,
  content,
  listHeader,
  listItem,
  listHeaderActions,
} from "./PrimaryNameOptionsList.css"
import { useCopied } from "@/hooks/useCopied"
import { useNavigate } from "react-router"

export const PrimaryNameOptionsList = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const navigate = useNavigate()

  return (
    <div className={container}>
      <div className={header}>
        <Typography fontVariant='headingOne'>L2 Primary Name</Typography>
      </div>
      <Input label="" placeholder="Search for a name or address" icon={<MagnifyingGlassSVG/>} onKeyDown={(e) => {
        if (e.key === "Enter") {
          navigate(`/${e.currentTarget.value}`)
        }
      }}/>
      <div className={content}>{children}</div>
    </div>
  )
}

const getManagerLink = (value: string) => {
  if (import.meta.env.DEV) {
    return `https://sepolia.app.ens.domains/${value}`
  }
  return `https://app.ens.domains/${value}`
}

const Header = ({ value, title }: { value: string; title: string }) => {
  const {copy, copied} = useCopied()
  return (
    <div className={listHeader}>
      <Typography fontVariant='headingTwo'>{title}</Typography>
      <div className={listHeaderActions}>
        <Button
          colorStyle='accentSecondary'
          shape='circle'
          onClick={() => copy(value)}
          width='10'
          height='10'
          px='0'
        >
          {copied ? <CheckSVG style={{ width: 12, height: 12 }} /> : <CopySVG style={{ width: 12, height: 12 }} />}
        </Button>
        <Button
          as="a"
          href={getManagerLink(value)}
          target='_blank'
          colorStyle='accentSecondary'
          shape='circle'
          width='10'
          height='10'
          px='0'
        >
          <OutlinkSVG style={{ width: 12, height: 12 }} />
        </Button>
      </div>
    </div>
  )
}

const Item = ({ children }: { children: React.ReactNode }) => {
  return <div className={listItem}>{children}</div>
}

PrimaryNameOptionsList.displayName = "PrimaryNameOptionsList"
PrimaryNameOptionsList.Header = Header
PrimaryNameOptionsList.Item = Item
