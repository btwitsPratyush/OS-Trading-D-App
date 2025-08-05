import React, { useState, useEffect } from 'react';
import { Bot, Users, TrendingUp, Plus, Github, ExternalLink, Activity } from 'lucide-react';
import { useJuliaOS } from './hooks/useJuliaOS';
import AgentCard from './components/AgentCard';
import SwarmDashboard from './components/SwarmDashboard';
import MarketData from './components/MarketData';
import TradeHistory from './components/TradeHistory';
import CreateAgentModal from './components/CreateAgentModal';

function App() {
  const {
    agents,
    swarms,
    marketData,
    trades,
    isLoading,
    fetchMarketData,
    executeSwarmStrategy,
    createAgent,
    supportedChains
  } = useJuliaOS();

  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'swarms' | 'trades'>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch initial market data
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const totalPnL = agents.reduce((sum, agent) => sum + agent.performance.profitLoss, 0);
  const avgSuccessRate = agents.length > 0 
    ? agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length 
    : 0;
  const totalTrades = agents.reduce((sum, agent) => sum + agent.performance.totalTrades, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">JuliaOS Trading dApp</h1>
                <p className="text-sm text-gray-500">Decentralized AI Agent Framework</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/juliaos/framework"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://docs.juliaos.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Docs</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'agents', label: 'Agents', icon: Bot },
              { id: 'swarms', label: 'Swarms', icon: Users },
              { id: 'trades', label: 'Trades', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total P&L</p>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${totalPnL.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {(avgSuccessRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Bot className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Agents</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {agents.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Trades</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTrades}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Market Data */}
            <MarketData 
              marketData={marketData} 
              onRefresh={fetchMarketData} 
              isLoading={isLoading} 
            />

            {/* Recent Trades */}
            <TradeHistory trades={trades.slice(-5)} />
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">AI Agents</h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Agent</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'swarms' && (
          <SwarmDashboard 
            swarms={swarms} 
            onExecuteStrategy={executeSwarmStrategy}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'trades' && (
          <TradeHistory trades={trades} />
        )}
      </main>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={createAgent}
        supportedChains={supportedChains}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">JuliaOS Trading dApp</h3>
              <p className="text-gray-600 mb-4">
                Advanced AI agent orchestration for decentralized trading across multiple blockchain networks.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/juliaos/framework"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://docs.juliaos.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  <span>AI Agent Framework</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Swarm Coordination</span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>Multi-Chain Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span>Real-time Analytics</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://docs.juliaos.ai" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/juliaos/framework" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/juliaos" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    Community Discord
                  </a>
                </li>
                <li>
                  <a href="https://api.juliaos.ai/docs" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-600 mb-4 md:mb-0">
                Built with JuliaOS Framework - Demonstrating AI Agent Orchestration & Multi-Chain Integration
              </p>
              <p className="text-gray-500 text-sm">
                Created by <span className="font-semibold text-indigo-600">Pratyush</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;