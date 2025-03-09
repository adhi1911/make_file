import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import * as api from './api';
import FileUpload from './components/FileUpload';
import HealthStatus from './components/HealthStatus';
import Configuration from './components/Configuration';
import GenerateFiles from './components/GenerateFiles';
import DownloadComponent from './components/Download';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<api.FileUploadResponse | null>(null);
  const [detailsResponse, setDetailsResponse] = useState<api.DetailsResponse | null>(null);
  const [targetColumn, setTargetColumn] = useState('');
  const [testSize, setTestSize] = useState(0.2);
  const [publicLeaderboard, setPublicLeaderboard] = useState(0.0);
  const [isPublicLeaderboard, setIsPublicLeaderboard] = useState(false);
  const [isBinary, setIsBinary] = useState(false);
  const [positiveLabel, setPositiveLabel] = useState('');
  const [negativeLabel, setNegativeLabel] = useState('');
  const [replaceLabel, setReplaceLabel] = useState<string | null>(null);
  const [isgeneratedFiles, issetGeneratedFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<api.HealthStatus | null>(null);

  const fetchHealthStatus = async () => {
    try {
      const status = await api.checkHealth();
      setHealthStatus(status);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch health status. Please try again.');
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const handleFileUpload = async (selectedFile: File) => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.uploadFile(selectedFile);
      setFile(selectedFile);
      setUploadResponse(response);
      await fetchHealthStatus();
    } catch (err: any) {
      setError(`Failed to upload file. Please try again. ${err.message}`);
    }
    setLoading(false);
  };

  const handlepublicLeaderboard = (n:number) => {
   
      setPublicLeaderboard(n);

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
        publicLeaderboard
      );
      setDetailsResponse(response);
    } catch (err: any) {
      setError( err.message);
    }
    setLoading(false);
    fetchHealthStatus();
  };

  const handleGenerateFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.generateFiles(
        isBinary,
        publicLeaderboard,
        positiveLabel,
        negativeLabel,
        replaceLabel
      );
      if(response.message === 'Files generated successfully' )
      {
      issetGeneratedFiles(true)
      } 
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
          <FileUpload onFileUpload={handleFileUpload} uploadResponse={uploadResponse} />
          
          {healthStatus && <HealthStatus healthStatus={healthStatus} />}

          {uploadResponse && (
            <Configuration
              targetColumn={targetColumn}
              setTargetColumn={setTargetColumn}
              testSize={testSize}
              publicLeaderboard={publicLeaderboard}
              setPublicLeaderboard={setPublicLeaderboard}
              setTestSize={setTestSize}
              isPublicLeaderboard={isPublicLeaderboard}
              setIsPublicLeaderboard={setIsPublicLeaderboard}
              isBinary={isBinary}
              setIsBinary={setIsBinary}
              positiveLabel={positiveLabel}
              setPositiveLabel={setPositiveLabel}
              negativeLabel={negativeLabel}
              setNegativeLabel={setNegativeLabel}
              replaceLabel={replaceLabel}
              setReplaceLabel={setReplaceLabel}
              onSetDetails={handleSetDetails}
              loading={loading}
              handlePublicLeaderboardChange={handlepublicLeaderboard}
            />
          )}

          {detailsResponse && (
            <GenerateFiles
              detailsResponse={detailsResponse}
              onGenerateFiles={handleGenerateFiles}
              loading={loading}
            />
          )}

          {isgeneratedFiles && (
            <DownloadComponent
              generatedFiles={['test.csv', 'train.csv']}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;