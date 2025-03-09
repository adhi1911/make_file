const API_BASE_URL = 'http://localhost:8000';

export interface FileUploadResponse {
  info: string;
  columns: string[];
  shape: [number, number];
  encoding: string;
}
export interface HealthStatus{
  uploaded_df: boolean;
  target_column: string | null;
  test_size: number | null;
  public_leaderboard: number | null;
 
}

export interface DetailsResponse {
  target_column: string;
  target_data: Record<string, number>;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  note: string;
}

export interface GeneratedFilesResponse {
  train: string;
  files : string[];
  message: string;
  public_leaderboard: number;
 
}

export interface HealthStatus {
  uploaded_df: boolean;
  target_column: string | null;
  test_size: number | null;
  public_leaderboard: number | null;
}

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/common/uploadfile/`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const setDetails = async (
  targetColumn: string,
  testSize: number,
  publicLeaderboard: number
): Promise<DetailsResponse> => {
  const formData = new FormData();
  console.log(targetColumn, testSize, publicLeaderboard);
  formData.append('target', targetColumn);
  formData.append('test_size_value', testSize.toString());
  formData.append('public_leaderboard_value', publicLeaderboard.toString());
  console.log(formData);
  const response = await fetch(`${API_BASE_URL}/common/details`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const generateFiles = async (
  isBinary: boolean,
  publicLeaderboard: number,
  positiveLabel?: string,
  negativeLabel?: string,
  replaceLabel?: string | null
): Promise<GeneratedFilesResponse> => {
  try {
    const endpoint = isBinary
      ? '/classification/split_and_generate_classification'
      : '/classification/split_and_generate';

    const body = isBinary
      ? JSON.stringify({ positive_label: positiveLabel, negative_label: negativeLabel, replace_label: replaceLabel, public_leaderboard: publicLeaderboard })
      : JSON.stringify({ public_leaderboard: publicLeaderboard });
   // console.log(body);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    console.error('Failed to generate files:', error.message);
    throw error;
  }
};

export const downloadFile = async (filename: string): Promise<Blob> => {
  const response = await fetch(
    `${API_BASE_URL}/classification/download/${filename}`
  );
  return response.blob();
};

export const checkHealth = async (): Promise<HealthStatus> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

// export const getFileFromUser = (): Promise<File | null> => {
//   return new Promise((resolve) => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.onchange = () => {
//       const file = input.files ? input.files[0] : null;
//       resolve(file);
//     };
//     input.click();
//   });
// };

// export const getColumns = async (): Promise<ColumnsResponse> => {
//   const response = await fetch(`${API_BASE_URL}/common/columns`);
//   return response.json();
// };
// export const getDetails = async (): Promise<DetailsResponse> => {
//   const response = await fetch(`${API_BASE_URL}/common/details`);
//   return response.json();
// }