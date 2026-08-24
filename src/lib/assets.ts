export type NetworkStatus = "healthy" | "congested" | "maintenance";

export type NetworkRule = {
  id: string;
  name: string;
  chain: string;
  status: NetworkStatus;
  depositEnabled: boolean;
  withdrawalEnabled: boolean;
  minWithdrawal: number;
  withdrawalFee: number;
  confirmations: number;
  estimatedMinutes: string;
  memoLabel?: string;
  explorerLabel: string;
};

export type Asset = {
  symbol: string;
  name: string;
  class: "stablecoin" | "native";
  price: number;
  accent: string;
  networks: NetworkRule[];
};

export const ASSETS: Asset[] = [
  {
    symbol: "USDT",
    name: "Tether",
    class: "stablecoin",
    price: 1,
    accent: "#72e6ae",
    networks: [
      {
        id: "tron",
        name: "TRON",
        chain: "TRC20",
        status: "healthy",
        depositEnabled: true,
        withdrawalEnabled: true,
        minWithdrawal: 10,
        withdrawalFee: 1,
        confirmations: 19,
        estimatedMinutes: "~1 min",
        explorerLabel: "TRONSCAN",
      },
      {
        id: "ethereum",
        name: "Ethereum",
        chain: "ERC20",
        status: "congested",
        depositEnabled: true,
        withdrawalEnabled: true,
        minWithdrawal: 25,
        withdrawalFee: 8,
        confirmations: 20,
        estimatedMinutes: "8-15 min",
        explorerLabel: "Etherscan",
      },
      {
        id: "solana",
        name: "Solana",
        chain: "SPL",
        status: "healthy",
        depositEnabled: true,
        withdrawalEnabled: true,
        minWithdrawal: 5,
        withdrawalFee: 0.5,
        confirmations: 32,
        estimatedMinutes: "<1 min",
        explorerLabel: "Solscan",
      },
    ],
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    class: "native",
    price: 117_420,
    accent: "#f5b95f",
    networks: [
      {
        id: "bitcoin",
        name: "Bitcoin",
        chain: "BTC",
        status: "healthy",
        depositEnabled: true,
        withdrawalEnabled: true,
        minWithdrawal: 0.0002,
        withdrawalFee: 0.00005,
        confirmations: 2,
        estimatedMinutes: "10-30 min",
        explorerLabel: "mempool.space",
      },
    ],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    class: "native",
    price: 4_286,
    accent: "#9a9ef7",
    networks: [
      {
        id: "ethereum",
        name: "Ethereum",
        chain: "ERC20",
        status: "congested",
        depositEnabled: true,
        withdrawalEnabled: true,
        minWithdrawal: 0.005,
        withdrawalFee: 0.0018,
        confirmations: 20,
        estimatedMinutes: "8-15 min",
        explorerLabel: "Etherscan",
      },
      {
        id: "arbitrum",
        name: "Arbitrum One",
        chain: "ARB",
        status: "healthy",
        depositEnabled: true,
        withdrawalEnabled: true,
        minWithdrawal: 0.002,
        withdrawalFee: 0.0004,
        confirmations: 64,
        estimatedMinutes: "2-4 min",
        explorerLabel: "Arbiscan",
      },
    ],
  },
  {
    symbol: "XRP",
    name: "XRP",
    class: "native",
    price: 3.24,
    accent: "#62c9ee",
    networks: [
      {
        id: "xrpl",
        name: "XRP Ledger",
        chain: "XRPL",
        status: "maintenance",
        depositEnabled: true,
        withdrawalEnabled: false,
        minWithdrawal: 12,
        withdrawalFee: 0.2,
        confirmations: 1,
        estimatedMinutes: "<1 min",
        memoLabel: "Destination tag",
        explorerLabel: "XRPSCAN",
      },
    ],
  },
];

export function findAsset(symbol: string) {
  return ASSETS.find((asset) => asset.symbol.toLowerCase() === symbol.toLowerCase());
}

export function findNetwork(assetSymbol: string, networkId: string) {
  return findAsset(assetSymbol)?.networks.find((network) => network.id === networkId);
}

export const DEFAULT_ADDRESSES: Record<string, string> = {
  tron: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
  ethereum: "0x000000000000000000000000000000000000dEaD",
  arbitrum: "0x000000000000000000000000000000000000dEaD",
  bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  solana: "Vote111111111111111111111111111111111111111",
  xrpl: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
};
