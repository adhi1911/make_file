from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import FileResponse
from src.services.binary_classification import split_and_generate_files, split_and_generate_binary_classification_files
import os
import src.globals as globals

router = APIRouter(
    tags=["classification"],
    prefix="/classification"
)

@router.post("/split_and_generate")
async def split_and_generate():
    """
    Split the data into train and test sets and generate the required files.

    Returns:
    - **message**: A success message indicating the files have been generated.
    """
    try:
        if globals.uploaded_df is None or globals.target_column is None or globals.test_size is None:
            raise HTTPException(status_code=400, detail="Data, target column, or test size not set")
        split_and_generate_files(globals.uploaded_df, globals.target_column, globals.test_size)
        return {"message": "Files generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/split_and_generate_classification")
async def split_and_generate_classification(positive_label: str = Form(...),
                                            negative_label: str = Form(...), 
                                            replace_label: str = Form(None)):
    """
    Split the data into train and test sets for binary classification and generate the required files.

    - **positive_label**: The value representing the positive class.
    - **negative_label**: The value representing the negative class.
    - **replace_label**: The value to replace other values with (if more than 2 unique values in the target column).
    
    Returns:
    - **message**: A success message indicating the files have been generated.
    """
    try:
        if globals.uploaded_df is None or globals.target_column is None or globals.test_size is None or globals.public_leaderboard is None:
            raise HTTPException(status_code=400,
                                detail="Data, target column, test size, or public leaderboard not set")
        split_and_generate_binary_classification_files(globals.uploaded_df, 
                                                       globals.target_column, 
                                                       globals.test_size, 
                                                       globals.public_leaderboard, 
                                                       positive_label, 
                                                       negative_label, 
                                                       replace_label)
        return {"message": "Files generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download the generated file.

    - **filename**: The name of the file to download.
    
    Returns:
    - **FileResponse**: The file to be downloaded.
    """
    file_path = os.path.join("generated_files", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type='application/octet-stream', filename=filename)