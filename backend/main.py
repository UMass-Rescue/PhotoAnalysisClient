from typing import List

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

import logging

app = FastAPI()

# Must have CORSMiddleware to enable localhost client and server
origins = [
    "http://localhost",
    "http://localhost:3000",
]

logger = logging.getLogger("api")

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
        'images': [
            {'name': 'image1', 'dataField1': 256, 'dataField2': 512},
            {'name': 'image2', 'dataField1': 300, 'dataField3': 'someImageResult'}
        ]
    }

    return results


@app.post("/images")
async def image_result(file: UploadFile = File(...)):
    logger.debug("Filename:" + file.filename)
    # TODO: Take image from request
    # TODO: Run model w/ image

    return {"filename": file.filename, "filesize": 256, "categories": 'example'}