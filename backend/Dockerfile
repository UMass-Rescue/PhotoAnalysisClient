FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
COPY backend/requirements.txt ./
COPY ./ /app
RUN pip --no-cache-dir install -r requirements.txt