import React, { useState } from 'react';
import { Agent } from '../types';
import { X, Bot, Plus } from 'lucide-react';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (config: Partial<Agent>) => void;
  supportedChains: string[];
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateAgent, 
  supportedChains 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'trading' as Agent['type'],
    strategy: 'balanced',
    riskTolerance: 0.5,
    maxPosition: 1000,
    chains: ['ethereum']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAgent({
      name: formData.name,
      type: formData.type,
      config: {
        strategy: formData.strategy,
        riskTolerance: formData.riskTolerance,
        maxPosition: formData.maxPosition,
        chains: formData.chains
      }
    });
    onClose();
    setFormData({
      name: '',
      type: 'trading',
      strategy: 'balanced',
      riskTolerance: 0.5,
      maxPosition: 1000,
      chains: ['ethereum']
    });
  };

  const handleChainToggle = (chain: string) => {
    setFormData(prev => ({
      ...prev,
      chains: prev.chains.includes(chain)
        ? prev.chains.filter(c => c !== chain)
        : [...prev.chains, chain]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            <span>Create New Agent</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter agent name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Agent['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="trading">Trading Agent</option>
              <option value="risk">Risk Management</option>
              <option value="arbitrage">Arbitrage Hunter</option>
              <option value="analysis">Market Analysis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategy
            </label>
            <select
              value={formData.strategy}
              onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
              <option value="momentum">Momentum</option>
              <option value="arbitrage">Arbitrage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Tolerance: {(formData.riskTolerance * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.riskTolerance}
              onChange={(e) => setFormData(prev => ({ ...prev, riskTolerance: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Position Size ($)
            </label>
            <input
              type="number"
              value={formData.maxPosition}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPosition: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="100"
              max="50000"
              step="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supported Chains
            </label>
            <div className="grid grid-cols-2 gap-2">
              {supportedChains.map(chain => (
                <label key={chain} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.chains.includes(chain)}
                    onChange={() => handleChainToggle(chain)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{chain}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Agent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentModal;