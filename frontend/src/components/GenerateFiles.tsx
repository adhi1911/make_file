import React from 'react';
import { FileCheck } from 'lucide-react';

interface GenerateFilesProps {
  detailsResponse: any;
  onGenerateFiles: () => void;
  loading: boolean;
}

const GenerateFiles: React.FC<GenerateFilesProps> = ({
  detailsResponse,
  onGenerateFiles,
  loading,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileCheck className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Generate Files</h2>
      </div>

      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Dataset Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <span className="block text-sm text-gray-500">Training Set</span>
            <span className="text-2xl font-bold text-gray-900">
              {detailsResponse.train_samples}
            </span>
            <span className="text-sm text-gray-500">samples</span>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <span className="block text-sm text-gray-500">Test Set</span>
            <span className="text-2xl font-bold text-gray-900">
              {detailsResponse.test_samples}
            </span>
            <span className="text-sm text-gray-500">samples</span>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerateFiles}
        disabled={loading}
        className="w-full py-3 px-6 text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? 'Generating...' : 'Generate Files'}
      </button>
    </div>
  );
};

export default GenerateFiles;