FROM python:3.8-slim-buster
WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
RUN python3 download_models.py
EXPOSE 8000
CMD ["python3", "app.py"]
