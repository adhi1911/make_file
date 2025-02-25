import React, { useState, useCallback,useEffect } from 'react';
import { Upload, FileCheck, Settings, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as api from './api';
import type { FileUploadResponse, DetailsResponse, HealthStatus } from './api';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<FileUploadResponse | null>(null);
  const [detailsResponse, setDetailsResponse] = useState<DetailsResponse | null>(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [testSize, setTestSize] = useState(0.2);
  const [isPublicLeaderboard, setIsPublicLeaderboard] = useState(false);
  const [isBinary, setIsBinary] = useState(false);
  const [positiveLabel, setPositiveLabel] = useState('');
  const [negativeLabel, setNegativeLabel] = useState('');
  const [replaceLabel, setReplaceLabel] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const fetchHealthStatus = async () => {
    try {
      const status = await api.checkHealth();
      setHealthStatus(status);
      console.log(status);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch health status. Please try again.');
    }
  };

  useEffect(() => {
    

    fetchHealthStatus();
  }, []);

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
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.uploadFile(selectedFile);
      setFile(selectedFile);
      setUploadResponse(response);
      const status = await api.checkHealth();
      setHealthStatus(status);
    } catch (err : any) {
      setError(`Failed to upload file. Please try again. ${err.message}`);
    }
    setLoading(false);
  };

  const handleSetDetails = async () => {
    if (!targetColumn) {
      setError('Please enter a target column name.');
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      const response = await api.setDetails(
        targetColumn,
        testSize,
        isPublicLeaderboard ? 0.5 : 0.0 // Assuming 50% for public leaderboard if checked
      );
      setDetailsResponse(response);
    } catch (err) {
      setError('Failed to set details. Please try again.');
    }
    fetchHealthStatus();
    setLoading(false);
  };

  const handleGenerateFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.generateFiles(
        isBinary,
        positiveLabel,
        negativeLabel,
        replaceLabel
      );
      setGeneratedFiles(Array.isArray(response.files) ? response.files : []);
    } catch (err) {
      setError('Failed to generate files. Please try again.');
    }
    setLoading(false);
    fetchHealthStatus();
  };

  const handleDownload = useCallback(async (filename: string) => {
    try {
      const blob = await api.downloadFile(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Failed to download ${filename}. Please try again.`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Machine Learning Dataset Processor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your CSV dataset, configure processing parameters, and generate train/test splits for your machine learning models.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* File Upload Section */}
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
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
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
                  <p className="text-sm text-green-600">
                    Detected encoding: {uploadResponse.encoding}
                  </p>
                </div>
              </div>
            )}
          </div>
            {/* Health Status Section */}
          {healthStatus && (
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
          )}
          {/* Configuration Section */}
          {uploadResponse && (
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
                  onClick={handleSetDetails}
                  disabled={loading}
                  className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Processing...' : 'Set Details'}
                </button>
              </div>
            </div>
          )}

          {/* Generate Files Section */}
          {detailsResponse && (
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
                onClick={handleGenerateFiles}
                disabled={loading}
                className="w-full py-3 px-6 text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Generating...' : 'Generate Files'}
              </button>
            </div>
          )}

          {/* Download Section */}
          {generatedFiles.length > 0 && (
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
                    onClick={() => handleDownload(filename)}
                    className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <Download className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">{filename}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;