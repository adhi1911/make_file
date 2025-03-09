import React from 'react';
import { Download } from 'lucide-react';

interface DownloadComponentProps {
  generatedFiles: string[];
  onDownload: (filename: string) => void;
}

const DownloadComponent: React.FC<DownloadComponentProps> = ({ generatedFiles, onDownload }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Download className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Download Files</h2>
      </div>

      <div className="grid gap-3">
        {generatedFiles.map((filename) => (
          <button
            key={filename}
            onClick={() => onDownload(filename)}
            className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Download className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">{filename}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DownloadComponent;