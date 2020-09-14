from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World123"}


@app.get("/images")
async def images():
    results = {
        'imagesTotal': 0,
        'imagesProcessed': 0,
        'imagesProcessing': 0,
        'imagesErrored': 0,
        'images': {'image1': 256, 'image2': 512}
    }

    return results
