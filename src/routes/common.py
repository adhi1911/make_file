from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pandas as pd
import os
import chardet
import src.globals as globals

router = APIRouter(
    tags=["common"],
    prefix="/common"
)

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a CSV file and display its column names.

    - **file**: The CSV file to be uploaded.
    
    Returns:
    - **info**: A success message indicating the file has been uploaded.
    - **columns**: A list of column names in the uploaded CSV file.
    """
    try:
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())

        # Detect the encoding of the file
        with open(file_location, "rb") as file_object:
            raw_data = file_object.read()
            result = chardet.detect(raw_data)
            encoding = result['encoding']

        # Read the uploaded file into a DataFrame with detected encoding
        df = pd.read_csv(file_location, encoding=encoding)

        # Store the DataFrame in a global variable for later use
        globals.uploaded_df = df

        return  {
            "status_code": 200,
            "info": f"File {file.filename} uploaded successfully",
            "columns": df.columns.tolist(),
            "shape": df.shape,
            "encoding": encoding
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/details")
async def details(target: str = Form(...), test_size_value: float = Form(...), public_leaderboard_value: float = Form(...)):
    """
    Set the target column for the uploaded DataFrame and display value counts.

    - **target**: The name of the target column.
    - **test_size_value**: The proportion of the dataset to include in the test split.
    - **public_leaderboard_value**: The proportion of the test set to be used for the public leaderboard.
    
    Returns:
    - **target_column**: The name of the target column.
    - **target_data**: A dictionary with value counts of the target column.
    - **total_samples**: The total number of samples in the dataset.
    - **train_samples**: The number of samples in the training set.
    - **test_samples**: The number of samples in the test set.
    - **note**: Note about rounding.
    """
    try:
        if globals.uploaded_df is None:
            raise HTTPException(status_code=400, detail="No file uploaded yet")
        
        # Check if target column is present in the dataframe
        if target not in globals.uploaded_df.columns:
            raise HTTPException(status_code=400, detail=f"Column {target} not present in the dataframe")

        # Set target column, test size, and public leaderboard
        globals.target_column = target
        globals.test_size = test_size_value
        globals.public_leaderboard = public_leaderboard_value

        print(f"Received target: {target}, test_size_value: {test_size_value}, public_leaderboard_value: {public_leaderboard_value}")
        
        # Extract the target column
        target_data = globals.uploaded_df[target].value_counts().to_dict()

        return {
            "target_column": target,
            "target_data": target_data,
            "total_samples": globals.uploaded_df.shape[0],
            "train_samples": int(float(globals.uploaded_df.shape[0]) * (1 - test_size_value)),
            "test_samples": int(float(globals.uploaded_df.shape[0]) * test_size_value),
            "note": "+-1 sample due to rounding"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))