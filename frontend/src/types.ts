export interface HealthStatus {
  dataframe: boolean;
  target_column: string | null;
  test_size: number | null;
  public_leaderboard: boolean;
}

export interface FileUploadResponse {
  message: string;
  encoding: string;
  preview: Record<string, any>[];
}

export interface DetailsResponse {
  value_counts: Record<string, number>;
  train_size: number;
  test_size: number;
}

export interface GeneratedFilesResponse {
  message: string;
  files: string[];
}