import React from 'react';
import { Settings } from 'lucide-react';

interface HealthStatusProps {
  healthStatus: any;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ healthStatus }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Settings className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Health Status</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Uploaded DataFrame
          </label>
          <p className="text-gray-900">{healthStatus.uploaded_df ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Column
          </label>
          <p className="text-gray-900">{healthStatus.target_column || 'Not set'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Size
          </label>
          <p className="text-gray-900">{healthStatus.test_size !== null ? healthStatus.test_size : 'Not set'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public Leaderboard
          </label>
          <p className="text-gray-900">{healthStatus.public_leaderboard !== null ? healthStatus.public_leaderboard : 'Not set'}</p>
        </div>
      </div>
    </div>
  );
};

export default HealthStatus;