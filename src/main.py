from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.routes import common, classification
import src.globals as globals
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    name = "SplitGen API",
    description = """
    Professional tool for preparing datasets for machine learning tasks
    
    github: https://github.com/adhi1911/make_file""",
    version = "0.1.0", 
    )

FRONT_END_PORT = 5173
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)