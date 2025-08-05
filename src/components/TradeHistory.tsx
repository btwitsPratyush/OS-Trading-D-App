import React from 'react';
import { Trade } from '../types';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const getStatusIcon = (status: Trade['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: Trade['type']) => {
    return type === 'buy' ? 
      <ArrowUpRight className="w-4 h-4 text-green-600" /> : 
      <ArrowDownLeft className="w-4 h-4 text-red-600" />;
  };

  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        <span>Trade History</span>
        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm">
          {trades.length}
        </span>
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedTrades.map(trade => (
          <div key={trade.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getTypeIcon(trade.type)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 capitalize">{trade.type}</span>
                    <span className="text-gray-600">{trade.symbol}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                      {trade.chain}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {trade.amount.toFixed(4)} @ ${trade.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(trade.status)}
                <span className="text-sm text-gray-500">
                  {new Date(trade.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 font-medium mb-1">AI Reasoning:</p>
              <p className="text-xs text-gray-600">{trade.reasoning}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Agent: {trade.agentId}</span>
              <span className={`font-semibold ${
                trade.status === 'completed' ? 'text-green-600' : 
                trade.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {trade.status === 'completed' ? `+$${(trade.amount * 0.02).toFixed(2)}` : 
                 trade.status === 'failed' ? `-$${(trade.amount * 0.01).toFixed(2)}` : 'Pending'}
              </span>
            </div>
          </div>
        ))}

        {trades.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trades executed yet. Run a swarm strategy to see trades here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeHistory;