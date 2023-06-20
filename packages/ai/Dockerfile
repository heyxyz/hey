FROM python:3.8-slim-buster
WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
RUN python3 download_models.py
EXPOSE 5000
CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]
