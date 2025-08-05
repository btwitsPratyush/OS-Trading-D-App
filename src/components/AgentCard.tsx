import React from 'react';
import { Agent } from '../types';
import { Bot, TrendingUp, TrendingDown, Activity, Shield, Zap, Target } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onSelect?: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect }) => {
  const getAgentIcon = (type: Agent['type']) => {
    switch (type) {
      case 'trading': return TrendingUp;
      case 'risk': return Shield;
      case 'arbitrage': return Zap;
      case 'analysis': return Target;
      default: return Bot;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'learning': return 'text-blue-500 bg-blue-100';
      case 'idle': return 'text-gray-500 bg-gray-100';
      case 'error': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const Icon = getAgentIcon(agent.type);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-indigo-200"
      onClick={() => onSelect?.(agent)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{agent.type} Agent</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
          {agent.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{agent.performance.totalTrades}</div>
          <div className="text-xs text-gray-500">Total Trades</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {(agent.performance.successRate * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Success Rate</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">P&L:</span>
        </div>
        <span className={`font-semibold ${agent.performance.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${agent.performance.profitLoss.toLocaleString()}
        </span>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">Last Action:</p>
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{agent.lastAction}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {agent.config.chains.map(chain => (
          <span key={chain} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
            {chain}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AgentCard;