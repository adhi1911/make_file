import React, { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadResponse: any;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadResponse }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      await onFileUpload(files[0]);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Upload Dataset</h2>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-gray-600">
            Drag and drop your CSV file here, or{' '}
            <span className="text-blue-600 hover:text-blue-700">browse</span>
          </span>
          <span className="text-sm text-gray-500 mt-2">
            Supported format: .csv
          </span>
        </label>
      </div>

      {uploadResponse && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-green-700 font-medium">File uploaded successfully!</p>
            <p className="text-sm text-green-600 pb-1">
              Detected encoding: {uploadResponse.encoding}
            </p>
            <p className="text-sm text-green-600 pb-1">
              Columns: {uploadResponse.columns.join(', ')}
            </p>
            <p className="text-sm text-green-600">
              Shape: {uploadResponse.shape[0]} rows, {uploadResponse.shape[1]} columns
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;