import { useState, useRef, useEffect } from "react"
import { Button, Dropdown } from "@ensdomains/thorin"
import { shortenAddress } from "@/utils/address"
import {
  profileButton,
  profileDropdown,
  profileAvatar,
  profileAddress,
  profileName,
  dropdownItem as dropdownItemStyle,
  dropdownDivider,
} from "./Profile.css"

interface DropdownItem {
  label: string | React.ReactNode
  onClick?: () => void
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  color?: string
  wrapper?: (children: React.ReactNode) => React.ReactNode
}

interface ProfileProps {
  address: string
  ensName?: string
  avatar?: string
  minWidth?: string
  dropdownItems?: (DropdownItem | React.ReactNode)[]
}

export const Profile = ({
  address,
  ensName,
  avatar,
  minWidth = "48",
  dropdownItems = [],
}: ProfileProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  const renderDropdownItem = (item: DropdownItem | React.ReactNode, index: number) => {
    if (!item || typeof item !== "object") return null
    
    if ("type" in item && typeof item.type === "function") {
      return <div key={index} className={dropdownDivider}>{item}</div>
    }

    const dropdownItem = item as DropdownItem
    const Icon = dropdownItem.icon
    
    const content = (
      <button
        type="button"
        className={dropdownItemStyle}
        onClick={() => {
          dropdownItem.onClick?.()
          setIsOpen(false)
        }}
        style={{
          color: dropdownItem.color === "redPrimary" ? "#DC2626" : undefined,
        }}
      >
        {Icon && <Icon width={16} height={16} />}
        <span>{dropdownItem.label}</span>
      </button>
    )

    if (dropdownItem.wrapper) {
      return <div key={index}>{dropdownItem.wrapper(content)}</div>
    }

    return <div key={index}>{content}</div>
  }

  return (
    <div style={{ position: "relative", minWidth: minWidth ? `${minWidth}px` : undefined }}>
      <button
        type="button"
        ref={buttonRef}
        className={profileButton}
        onClick={handleButtonClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={profileAvatar}>
          {avatar ? (
            <img src={avatar} alt={ensName || address} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div />
          )}
        </div>
        {ensName ? (
          <div className={profileName}>{ensName}</div>
        ) : (
          <div className={profileAddress}>{shortenAddress(address)}</div>
        )}
      </button>
      
      {isOpen && (
        <div ref={dropdownRef} className={profileDropdown}>
          {dropdownItems.map((item, index) => renderDropdownItem(item, index))}
        </div>
      )}
    </div>
  )
}