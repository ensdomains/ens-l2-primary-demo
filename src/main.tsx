import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Buffer } from "buffer"
import React from "react"
import ReactDOM from "react-dom/client"
import { WagmiProvider } from "wagmi"
import { BrowserRouter, Routes, Route } from "react-router"

import { wagmiConfig } from "./wagmi.ts"

import { ThemeProvider } from "@ensdomains/thorin"
import "@ensdomains/thorin/dist/thorin.css"
import "@rainbow-me/rainbowkit/styles.css"
import "./index2.css"
import { Layout } from "./components/layouts/Layout/Layout.tsx"
import { IdentifierPage } from "./components/pages/IdentifierPage.tsx"
import { SplashPage } from "./components/pages/SplashPage/SplashPage.tsx"
import { TransactionStoreProvider } from "./providers/TransactionStoreProvider.tsx"
import { IntercomProvider} from 'react-use-intercom'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider defaultMode='light'>
            <TransactionStoreProvider>
              <IntercomProvider appId={import.meta.env.VITE_INTERCOM_ID || 'eotmigir'} autoBoot>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path='/' element={<SplashPage />} />
                    <Route path='/:identifier' element={<IdentifierPage />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
              </IntercomProvider>
            </TransactionStoreProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
