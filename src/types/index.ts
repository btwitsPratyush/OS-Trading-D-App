export interface Agent {
  id: string;
  name: string;
  type: 'trading' | 'analysis' | 'risk' | 'arbitrage';
  status: 'active' | 'idle' | 'error' | 'learning';
  performance: {
    totalTrades: number;
    successRate: number;
    profitLoss: number;
    sharpeRatio: number;
  };
  config: {
    riskTolerance: number;
    maxPosition: number;
    strategy: string;
    chains: string[];
  };
  lastAction: string;
  createdAt: Date;
}

export interface SwarmConfig {
  id: string;
  name: string;
  agents: Agent[];
  coordination: 'hierarchical' | 'democratic' | 'competitive';
  objective: string;
  status: 'running' | 'paused' | 'optimizing';
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  chain: string;
  timestamp: Date;
}

export interface Trade {
  id: string;
  agentId: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  chain: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  reasoning: string;
}

export interface LLMResponse {
  decision: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  riskAssessment: number;
  targetPrice?: number;
}