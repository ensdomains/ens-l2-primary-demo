import { useEffect, useState } from "react"

export const MagicDevPanel = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown) 
    }

  }, [])

  if (!isOpen) return null
  return <div>
    <div style={{ fontSize: '10px', color: 'gray', marginBottom: '10px' }}>
      press ctrl + d to toggle dev panel
    </div>
    {children}</div>
}