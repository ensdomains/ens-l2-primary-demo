import { PrimaryOption } from "@/constants/primaryNameOptions"
import { NameData, useNameData } from "@/hooks/useNameData"
import { Typography } from "@ensdomains/thorin"
import { MagicDevPanel } from "../atoms/MagicDevPanel"
import { shortenAddress } from "@/utils/address"
import { Divider } from "../atoms/Divider/Divider"

export const NameCentricOptionDebugPanel = ({
  name,
  resolvedValue,
  sourceValue,
  nameData,
  option,
}: {
  name: string
  resolvedValue?: string | null
  sourceValue?: string | null
  nameData?: NameData | null
  option: PrimaryOption
}) => {
  const nameAddress = nameData?.coins.find(
    (coin) => coin.coinType === option.chain.coinType,
  )?.value

  const resolvedNameData = useNameData({
    name: resolvedValue ?? undefined,
  })
  const resolvedAddress = resolvedNameData?.data?.coins.find(
    (coin) => coin.coinType === option.chain.coinType,
  )?.value

  const sourceNameData = useNameData({
    name: sourceValue ?? undefined,
  })
  const sourceAddress = sourceNameData?.data?.coins.find(
    (coin) => coin.coinType === option.chain.coinType,
  )?.value

  return (
    <MagicDevPanel>
      <div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Typography fontVariant='extraSmall' color='grey'>
            name:
          </Typography>
          <Typography fontVariant='extraSmall'>{name}</Typography>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Typography fontVariant='extraSmall' color='grey'>
            {name} address record:
          </Typography>
          <Typography fontVariant='extraSmall'>{nameAddress}</Typography>
        </div>
        <Divider />
        {nameAddress && (
          <>
            <div style={{ display: "flex", gap: "10px" }}>
              <Typography fontVariant='extraSmall' color='grey'>
                UR value for {shortenAddress(nameAddress)}:
              </Typography>
              <Typography fontVariant='extraSmall'>{resolvedValue}</Typography>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Typography fontVariant='extraSmall' color='grey'>
                Address record for {resolvedValue}:
              </Typography>
              <Typography fontVariant='extraSmall'>
                {resolvedAddress}
              </Typography>
            </div>
            <Divider />
            <div style={{ display: "flex", gap: "10px" }}>
              <Typography fontVariant='extraSmall' color='grey'>
                L2 value for {shortenAddress(nameAddress)}:
              </Typography>
              <Typography fontVariant='extraSmall'>{sourceValue}</Typography>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Typography fontVariant='extraSmall' color='grey'>
                Address record for {sourceValue}:
              </Typography>
              <Typography fontVariant='extraSmall'>{sourceAddress}</Typography>
            </div>
          </>
        )}
      </div>
    </MagicDevPanel>
  )
}
