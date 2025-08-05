import React from 'react';
import { SwarmConfig } from '../types';
import { Users, Play, Pause, Settings, TrendingUp, Activity } from 'lucide-react';

interface SwarmDashboardProps {
  swarms: SwarmConfig[];
  onExecuteStrategy: (swarmId: string) => void;
  isLoading: boolean;
}

const SwarmDashboard: React.FC<SwarmDashboardProps> = ({ swarms, onExecuteStrategy, isLoading }) => {
  const getCoordinationColor = (coordination: SwarmConfig['coordination']) => {
    switch (coordination) {
      case 'hierarchical': return 'text-purple-600 bg-purple-100';
      case 'democratic': return 'text-blue-600 bg-blue-100';
      case 'competitive': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: SwarmConfig['status']) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'optimizing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Users className="w-8 h-8 text-indigo-600" />
          <span>Swarm Orchestration</span>
        </h2>
      </div>

      {swarms.map(swarm => (
        <div key={swarm.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{swarm.name}</h3>
              <p className="text-gray-600 mb-4">{swarm.objective}</p>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCoordinationColor(swarm.coordination)}`}>
                  {swarm.coordination} coordination
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swarm.status)}`}>
                  {swarm.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => onExecuteStrategy(swarm.id)}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Strategy</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Agents</span>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {swarm.agents.filter(a => a.status === 'active').length}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Performance</span>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                ${swarm.agents.reduce((sum, agent) => sum + agent.performance.profitLoss, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Success Rate</span>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-indigo-600 mt-2">
                {(swarm.agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / swarm.agents.length * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Agent Composition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {swarm.agents.map(agent => (
                <div key={agent.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 
                    agent.status === 'learning' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{agent.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {(agent.performance.successRate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SwarmDashboard;