from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World123"}


@app.get("/images")
async def images():
    results = {
        'imagesTotal': 10,
        'imagesProcessed': 20,
        'imagesProcessing': 30,
        'imagesErrored': 40,
        'images': {
            'image1': {'dataField1': 256, 'dataField2': 512},
            'image2': {'dataField1': 300, 'dataField3': 'someImageResult'}
        }
    }

    return results


@app.post("/images")
async def images():
    # TODO: Take image from request
    # TODO: Run model w/ image
    # TODO: Make processed image available
    pass