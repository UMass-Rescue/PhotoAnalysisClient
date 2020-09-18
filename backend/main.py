from typing import List

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from scenedetect.db_utils import create_db
from scenedetect.scene_detect_model import get_scene_attributes

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

# Create a SQLite database that holds result of scene detection
create_db()

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
async def images(file: UploadFile = File(...)):
    logger.debug("Filename:" + file.filename)
    # TODO: Take image from request
    # TODO: Run model w/ image
    scene_categories_prob, scene_attrs = get_scene_attributes(file.file, file.filename)

    # Sort the categories by probability
    scene_categories_prob = {k: v for k, v in sorted(scene_categories_prob.items(), key=lambda item: item[1], reverse=True)}

    # TODO: Make processed image available
    logger.debug({"filename": file.filename, "filesize": 256, "categories": scene_categories_prob})
    return {"filename": file.filename, "filesize": 256, "categories": scene_categories_prob}