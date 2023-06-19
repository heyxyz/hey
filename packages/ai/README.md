# AI

### Available models and endpoints

| Model           | Endpoint  | Description                  |
| --------------- | --------- | ---------------------------- |
| Tagger          | `/tagger` | Predict the topic for a text |
| NSFW            | `/nsfw`   | Predict if a text is NSFW    |
| Locale Detector | `/locale` | Detect the locale of a text  |

### Setup

Install the required packages:

```sh
pip install -r requirements.txt
```

### Download the model

Download the model from HuggingFace:

```sh
python download_models.py
```

### Run the app

Run the app in port 8000:

```sh
python app.py
```

## Setup with Docker

Pull the image from Docker Hub:

```sh
docker pull yoginth/ai:latest
```

Run the image:

```sh
docker run -p 5000:5000 yoginth/ai:latest
```
