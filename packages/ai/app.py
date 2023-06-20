import torch
from flask import Flask, jsonify, request
from scipy.special import expit
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Initialize the tagger model
topic_hf = "models/tagger"
topic_tokenizer = AutoTokenizer.from_pretrained(topic_hf)
topic_model = AutoModelForSequenceClassification.from_pretrained(topic_hf)
topic_class_mapping = topic_model.config.id2label

# Initialize the locale model
locale_hf = "models/locale_detector"
locale_tokenizer = AutoTokenizer.from_pretrained(locale_hf)
locale_model = AutoModelForSequenceClassification.from_pretrained(locale_hf)
locale_class_mapping = locale_model.config.id2label


app = Flask(__name__)


@app.route("/")
def index():
    return "Welcome to Lenster AI ✨"


# Health check
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"ping": "pong"})


def predictTopic(text):
    tokens = topic_tokenizer(text, return_tensors="pt")
    output = topic_model(**tokens)
    scores = expit(output.logits.detach().numpy())
    topics = [topic_class_mapping[i] for i in range(len(scores[0]))]
    topic_scores = [
        {"topic": topic, "score": float(score)}
        for topic, score in zip(topics, scores[0])
    ]
    topic_scores = sorted(topic_scores, key=lambda x: x["score"], reverse=True)

    return topic_scores


# Extract topic from the text
@app.route("/tagger", methods=["POST"])
def tagger():
    data = request.get_json()
    text = data["text"]

    # Check if text has more than 5 words
    if len(text.split()) > 5:
        topic_scores = predictTopic(text)
        return jsonify({"topics": topic_scores})
    else:
        return jsonify({"topics": []})


def predictLocale(text):
    tokens = locale_tokenizer(text, return_tensors="pt")
    output = locale_model(**tokens)
    predictions = torch.nn.functional.softmax(output.logits, dim=-1)
    _, preds = torch.max(predictions, dim=-1)

    return locale_class_mapping[preds.item()]


# Extract locale from the text
@app.route("/locale", methods=["POST"])
def locale():
    data = request.get_json()
    text = data["text"]

    # Check if text has more than 5 words
    if len(text.split()) > 5:
        locale_scores = predictLocale(text)
        return jsonify({"locale": locale_scores})
    else:
        return jsonify({"locale": None})


if __name__ == "__main__":
    app.run(debug=False)
