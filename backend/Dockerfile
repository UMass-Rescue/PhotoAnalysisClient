# Base Image: FastAPI
FROM tiangolo/uvicorn-gunicorn:python3.8-alpine3.10

WORKDIR /app

COPY ./ /app

RUN pip --no-cache-dir install -r requirements.txt


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5057", "--debug", "--reload-dir", "/app"]