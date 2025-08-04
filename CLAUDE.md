# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run Biome linter and formatter
- `npm test` - Run tests with Vitest
- `npm run preview` - Preview production build locally

## Project Architecture

This is an ENS (Ethereum Name Service) L2 Primary Name management application built with React, TypeScript, and Vite. The app allows users to manage primary names across multiple blockchain networks.

### Core Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with React plugin, Vanilla Extract CSS, and tsconfig paths
- **Blockchain**: Wagmi v2 + Viem for Web3 interactions
- **Wallet**: RainbowKit for wallet connections
- **State**: React Query for server state, Zustand for local transaction state
- **Styling**: Vanilla Extract CSS-in-JS + ENS Thorin design system
- **Routing**: React Router v7
- **Linting**: Biome (replaces ESLint/Prettier)

### Application Structure

#### Identifier-Based Routing
The app uses a single dynamic route `/:identifier` that handles both ENS names and Ethereum addresses:
- **Names**: Normalized to include `.eth` TLD if missing (e.g., `vitalik` → `vitalik.eth`)
- **Addresses**: Must be valid Ethereum addresses (checksummed)
- Route handling in `src/components/pages/IdentifierPage.tsx:25`

#### View Architecture
Two main view patterns based on identifier type:
- **NameCentricView**: For ENS name identifiers - manages primary name settings for a specific name
- **AddressCentricView**: For address identifiers - manages primary names for a specific address

#### Chain Support
Multi-chain application with L1/L2 primary name synchronization:
- Chain definitions in `src/constants/chains.ts`
- Chain metadata and RPC configuration in `src/utils/chainModifiers/`
- L2 chains reference L1 source via `sourceId` property

#### State Management
- **Transaction State**: Zustand store in `src/stores/transactionStore.ts` for managing transaction flows
- **Server State**: React Query for ENS data fetching and caching
- **Provider Setup**: All providers configured in `src/main.tsx:25`

#### Key Hooks
- `useSourcePrimaryName`: Core hook for fetching primary name data across chains
- `useAccountWithSafeSwitchChain`: Handles wallet account and safe chain switching
- `useCheckAddressAndChain`: Validates current wallet state
- Transaction hooks in `src/hooks/send-transactions/` for blockchain interactions

#### Component Organization
- **Atoms**: Basic UI components (Skeleton, Tooltip, LoadBar)
- **Molecules**: Composed components (PrimaryNameOption, TransactionDialog)  
- **Views**: Full page/section components with business logic
- **Layouts**: App shell components (Header, Layout)

#### Styling
- Vanilla Extract for type-safe CSS-in-JS
- ENS Thorin design system components
- Component-specific `.css.ts` files co-located with components

### Environment Variables
- `VITE_WC_PROJECT_ID`: WalletConnect project ID for wallet connections
- `VITE_INTERCOM_ID`: Intercom app ID for customer support integration