#  Multi-Chain Crypto Portfolio Checker

### Live Demo: https://portfolio-checker.vercel.app/

Portfolio Checker is a modern web application that allows users to track their cryptocurrency portfolio across multiple blockchains in one unified interface. Built with Next.js, React 19, and TypeScript, it provides a clean and intuitive way to monitor token balances across various EVM-compatible chains.

## Features

- **Multi-Chain Support**: Track assets across Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche, and Base networks
- **Portfolio Overview**: View your complete portfolio with token balances and USD values
- **Search History**: Easily access previously viewed wallets
- **Popular Addresses**: Quickly explore notable wallets on each chain

## Installation and Setup

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rubenmarcus/portfolio-checker.git
cd portfolio-checker

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
ANKR_API_KEY=your_ankr_api_key_here
```

You can obtain an API key by signing up at [Ankr](https://www.ankr.com/), which provides the blockchain infrastructure for this application.

### Running the Application

```bash
# Development mode with hot reloading (uses Turbopack)
npm run dev
# or
pnpm dev
# or
yarn dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Why Ankr?

Ankr was chosen as the blockchain infrastructure provider for several reasons:

1. **Multi-Chain Support**: Ankr's API provides unified access to multiple EVM-compatible blockchains through a single endpoint
2. **Performance**: Fast and reliable RPC service with high availability
3. **Simplified Integration**: The `ankr_getAccountBalance` method returns token balances with price data in a single call
4. **Developer-Friendly**: Comprehensive documentation and reasonable rate limits, even on the free tier

## Technical Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React Context API
- **Data Fetching**: Server components and Next.js API routes
- **Web3 Integration**: Viem for blockchain interactions
- **Code Quality**: Biome for linting and formatting

### Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── [chain]/        # Dynamic routes for chain pages
│   │   └── [address]/  # Dynamic routes for address pages
│   ├── api/            # API routes
│   └── page.tsx        # Homepage
├── components/         # React components
├── context/            # React context providers
├── data/               # Data constants and API clients
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

### Key Design Decisions

1. **App Router**: Leverages Next.js 15's App Router for efficient page routing and data loading
2. **Server Components**: Utilizes React Server Components where applicable for improved performance
3. **Mobile-First Design**: Responsive UI that works well on devices of all sizes
4. **Modular Architecture**: Components are organized for reusability and maintainability

## React/TypeScript Implementation

The application follows modern React patterns and TypeScript best practices:

- **Function Components**: All components are functional with hooks for state management
- **Strong Typing**: Comprehensive TypeScript types for all data structures
- **Custom Hooks**: Abstracts complex logic into reusable hooks (e.g., `useTokenData`)
- **Context API**: Uses React Context for global state like wallet history
- **Client Components**: Uses the 'use client' directive for interactive components while leveraging server components where possible
- **Error Handling**: Comprehensive error handling for API requests and user interactions

## Development

```bash
# Run linting
pnpm run lint

# Check types
pnpm run check

# Fix code style issues
pnpm run check:fix
```



## License

MIT

---

This project is not affiliated with Ankr or any blockchain project. It is an open-source tool for educational purposes.
