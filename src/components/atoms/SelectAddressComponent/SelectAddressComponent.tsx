import { shortenAddress } from "@/utils/address"
import { Input, RadioButton, Typography } from "@ensdomains/thorin"
import { useRef, useState } from "react"
import { Address } from "viem"

export const SelectAddressComponent = ({
  selectedAddress,
  addressData,
  onChange,
}: {
  selectedAddress: Address | string
  addressData: {address: Address, name: string}[]
  onChange: (address: string) => void
}) => {

  const addresses = addressData.map(({ address }) => address)
  
  const [customAddress, setCustomAddress] = useState<string>(
    addresses.includes(selectedAddress as Address)
      ? ""
      : selectedAddress,
  )
  const ref = useRef<HTMLInputElement>(null)
  return (
    <form
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      onChange={(e) => {
        const target = e.target as HTMLInputElement
        if (target.value === "custom") onChange(customAddress)
        else onChange(target.value as Address)
      }}
    >
      {addresses.map((address) => (
        <RadioButton
          key={address}
          label={
            <Typography fontVariant='largeBold'>
              {shortenAddress(address)}
            </Typography>
          }
          value={address}
          name='target-address'
          checked={selectedAddress === address}
        />
      ))}
      <RadioButton
        ref={ref}
        label='Custom'
        value='custom'
        name='target-address'
        checked={!addresses.includes(selectedAddress as Address)}
      />
      <Input
        label=''
        placeholder='Enter address'
        value={customAddress}
        onChange={(e) => {
          setCustomAddress(e.target.value)
          if (ref.current?.checked) onChange(e.target.value)
        }}
      />
    </form>
  )
}
