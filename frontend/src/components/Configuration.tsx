import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface ConfigurationProps {
  targetColumn: string;
  setTargetColumn: (value: string) => void;
  testSize: number;
  setTestSize: (value: number) => void;
  publicLeaderboard: number, 
  setPublicLeaderboard:(value: number) => void;
  isPublicLeaderboard: boolean;
  setIsPublicLeaderboard: (value: boolean) => void;
  isBinary: boolean;
  setIsBinary: (value: boolean) => void;
  positiveLabel: string;
  setPositiveLabel: (value: string) => void;
  negativeLabel: string;
  setNegativeLabel: (value: string) => void;
  replaceLabel: string | null;
  setReplaceLabel: (value: string | null) => void;
  onSetDetails: () => void;
  loading: boolean;
  handlePublicLeaderboardChange: (value: number) => void;
}

const Configuration: React.FC<ConfigurationProps> = ({
  targetColumn,
  setTargetColumn,
  testSize,
  setTestSize,
  isPublicLeaderboard,
  setIsPublicLeaderboard,
  publicLeaderboard,
  setPublicLeaderboard,
  isBinary,
  setIsBinary,
  positiveLabel,
  setPositiveLabel,
  negativeLabel,
  setNegativeLabel,
  replaceLabel,
  setReplaceLabel,
  onSetDetails,
  handlePublicLeaderboardChange,
  loading,
}) => {
  

    
    
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Settings className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Configure Processing</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Column
          </label>
          <input
            type="text"
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter target column name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Size: {(testSize * 100).toFixed(0)}%
          </label>
          <input
            title='Test Size'
            type="range"
            min="0.1"
            max="0.5"
            step="0.1"
            value={testSize}
            onChange={(e) => setTestSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors duration-200">
            <input
              title='Public Leaderboard'
              type="checkbox"
              checked={isPublicLeaderboard}
              onChange={(e) => setIsPublicLeaderboard(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="block font-medium text-gray-900">Public Leaderboard</span>
              <span className="text-sm text-gray-500">Make results publicly visible</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors duration-200">
            <input
              type="checkbox"
              checked={isBinary}
              onChange={(e) => setIsBinary(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="block font-medium text-gray-900">Binary Classification</span>
              <span className="text-sm text-gray-500">Two-class prediction task</span>
            </div>
          </label>
        </div>

        {isPublicLeaderboard && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Leaderboard Value
            </label>
            <input
              type="number"
              value={publicLeaderboard}
              onChange={(e) => handlePublicLeaderboardChange(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter public leaderboard value"
            />
          </div>
        )}

        {isBinary && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Positive Label
            </label>
            <input
              type="text"
              value={positiveLabel}
              onChange={(e) => setPositiveLabel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter positive label"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Negative Label
            </label>
            <input
              type="text"
              value={negativeLabel}
              onChange={(e) => setNegativeLabel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter negative label"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Replace Label (optional)
            </label>
            <input
              type="text"
              value={replaceLabel || ''}
              onChange={(e) => setReplaceLabel(e.target.value || null)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter replace label"
            />
          </div>
        )}

        <button
          onClick={onSetDetails}
          disabled={loading}
          className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Processing...' : 'Set Details'}
        </button>
      </div>
    </div>
  );
};

export default Configuration;