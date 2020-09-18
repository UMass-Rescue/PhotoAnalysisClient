# Base Image: FastAPI

## Could not install dependencies for scene_detection with this base image, use the previous version instead
# FROM tiangolo/uvicorn-gunicorn:python3.8-alpine3.10
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

WORKDIR /app

COPY ./ /app

RUN pip install --upgrade pip

RUN pip --no-cache-dir install -r requirements.txt


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5057", "--debug", "--reload-dir", "/app", "--log-level", "debug"]