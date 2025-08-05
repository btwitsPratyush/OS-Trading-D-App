import { useState, useEffect, useCallback } from 'react';
import { Agent, SwarmConfig, MarketData, Trade } from '../types';
import { JuliaOSAgent, JuliaOSSwarm, MultiChainConnector } from '../services/juliaos';

export const useJuliaOS = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [swarms, setSwarms] = useState<SwarmConfig[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const multiChain = new MultiChainConnector();

  // Initialize demo agents
  useEffect(() => {
    const demoAgents: Agent[] = [
      {
        id: 'agent_1',
        name: 'Alpha Trader',
        type: 'trading',
        status: 'active',
        performance: {
          totalTrades: 156,
          successRate: 0.73,
          profitLoss: 12450,
          sharpeRatio: 1.8
        },
        config: {
          riskTolerance: 0.6,
          maxPosition: 5000,
          strategy: 'momentum',
          chains: ['ethereum', 'polygon']
        },
        lastAction: 'Bought 0.5 ETH on Ethereum',
        createdAt: new Date(Date.now() - 86400000 * 7)
      },
      {
        id: 'agent_2',
        name: 'Risk Guardian',
        type: 'risk',
        status: 'active',
        performance: {
          totalTrades: 89,
          successRate: 0.85,
          profitLoss: 8920,
          sharpeRatio: 2.1
        },
        config: {
          riskTolerance: 0.3,
          maxPosition: 2000,
          strategy: 'conservative',
          chains: ['ethereum', 'arbitrum']
        },
        lastAction: 'Risk assessment: Medium volatility detected',
        createdAt: new Date(Date.now() - 86400000 * 5)
      },
      {
        id: 'agent_3',
        name: 'Arbitrage Hunter',
        type: 'arbitrage',
        status: 'learning',
        performance: {
          totalTrades: 234,
          successRate: 0.68,
          profitLoss: 15670,
          sharpeRatio: 1.6
        },
        config: {
          riskTolerance: 0.8,
          maxPosition: 10000,
          strategy: 'arbitrage',
          chains: ['ethereum', 'polygon', 'arbitrum', 'optimism']
        },
        lastAction: 'Scanning cross-chain opportunities',
        createdAt: new Date(Date.now() - 86400000 * 3)
      }
    ];

    setAgents(demoAgents);

    const demoSwarm: SwarmConfig = {
      id: 'swarm_1',
      name: 'Elite Trading Swarm',
      agents: demoAgents,
      coordination: 'democratic',
      objective: 'Maximize risk-adjusted returns across multiple chains',
      status: 'running'
    };

    setSwarms([demoSwarm]);
  }, []);

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    try {
      const chains = ['ethereum', 'polygon', 'arbitrum'];
      const symbols = ['ETH', 'BTC', 'MATIC', 'ARB'];
      
      const allData: MarketData[] = [];
      for (const chain of chains) {
        const data = await multiChain.getMarketData(chain, symbols);
        allData.push(...data);
      }
      
      setMarketData(allData);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Execute swarm strategy
  const executeSwarmStrategy = useCallback(async (swarmId: string) => {
    const swarm = swarms.find(s => s.id === swarmId);
    if (!swarm || marketData.length === 0) return;

    setIsLoading(true);
    try {
      const juliaSwarm = new JuliaOSSwarm(swarm.coordination);
      
      // Add agents to swarm
      swarm.agents.forEach(agent => {
        const juliaAgent = new JuliaOSAgent(agent);
        juliaSwarm.addAgent(juliaAgent);
      });

      // Execute coordinated strategy
      const newTrades = await juliaSwarm.coordinateStrategy(marketData);
      
      // Execute trades on blockchain
      const executedTrades = await Promise.all(
        newTrades.map(async (trade) => {
          const success = await multiChain.executeTrade(trade);
          return {
            ...trade,
            status: success ? 'completed' : 'failed'
          } as Trade;
        })
      );

      setTrades(prev => [...prev, ...executedTrades]);

      // Update agent performance
      setAgents(prev => prev.map(agent => {
        const agentTrades = executedTrades.filter(t => t.agentId === agent.id);
        if (agentTrades.length > 0) {
          const successfulTrades = agentTrades.filter(t => t.status === 'completed').length;
          const newTotalTrades = agent.performance.totalTrades + agentTrades.length;
          const newSuccessRate = (agent.performance.successRate * agent.performance.totalTrades + successfulTrades) / newTotalTrades;
          
          return {
            ...agent,
            performance: {
              ...agent.performance,
              totalTrades: newTotalTrades,
              successRate: newSuccessRate,
              profitLoss: agent.performance.profitLoss + agentTrades.reduce((sum, t) => 
                sum + (t.status === 'completed' ? t.amount * 0.02 : -t.amount * 0.01), 0
              )
            },
            lastAction: `Executed ${agentTrades.length} trades`,
            status: 'active' as const
          };
        }
        return agent;
      }));

    } catch (error) {
      console.error('Failed to execute swarm strategy:', error);
    } finally {
      setIsLoading(false);
    }
  }, [swarms, marketData]);

  // Create new agent
  const createAgent = useCallback((config: Partial<Agent>) => {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: config.name || 'New Agent',
      type: config.type || 'trading',
      status: 'idle',
      performance: {
        totalTrades: 0,
        successRate: 0,
        profitLoss: 0,
        sharpeRatio: 0
      },
      config: {
        riskTolerance: 0.5,
        maxPosition: 1000,
        strategy: 'balanced',
        chains: ['ethereum'],
        ...config.config
      },
      lastAction: 'Agent created',
      createdAt: new Date()
    };

    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  }, []);

  return {
    agents,
    swarms,
    marketData,
    trades,
    isLoading,
    fetchMarketData,
    executeSwarmStrategy,
    createAgent,
    supportedChains: multiChain.getSupportedChains()
  };
}