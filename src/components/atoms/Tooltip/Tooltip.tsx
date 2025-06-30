import { useState } from "react"

import { useRef } from "react"
import { anchorWrapper, tooltipArrow, tooltipArrowShadow, tooltipContainer } from "./Tooltip.css"

type TooltipProps = {
  content: React.ReactNode
  children: React.ReactNode
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 100)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  const toggleTooltip = () => setVisible((v) => !v)

  return (
    <div
      className={anchorWrapper}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onClick={toggleTooltip}
    >
      {children}
      {visible && (
        <div className={tooltipContainer}>
          {content}
          <div className={tooltipArrowShadow} />
          <div className={tooltipArrow} />
        </div>
      )}
    </div>
  )
}
