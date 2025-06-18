import { Header } from "./Header"
import { layout } from "./Layout.css"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={layout}>
      <Header />
      <div>{children}</div>
    </div>
  )
}
