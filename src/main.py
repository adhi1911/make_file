from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.routes import common, classification
import src.globals as globals

app = FastAPI()

app.include_router(common.router)
app.include_router(classification.router)

app.mount("/generated_files", StaticFiles(directory="generated_files"), name="generated_files")

@app.get("/root")
def read_root():
    return {"Root": "Still Alive"}

@app.get("/health")
def health():
    return {
        "uploaded_df": globals.uploaded_df is not None,
        "target_column": globals.target_column,
        "test_size": globals.test_size,
        "public_leaderboard": globals.public_leaderboard
    }