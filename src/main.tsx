import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { wagmiConfig } from "./wagmi.ts";

import { ThemeProvider } from "@ensdomains/thorin";
import "@ensdomains/thorin/style.css";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
