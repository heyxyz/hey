import torch
from flask import Flask, jsonify, request
from scipy.special import expit
from transformers import AutoModelForSequenceClassification, AutoTokenizer

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize the model
topic_hf = "models/topic_model"
topic_tokenizer = AutoTokenizer.from_pretrained(topic_hf)
topic_model = AutoModelForSequenceClassification.from_pretrained(topic_hf)
topic_class_mapping = topic_model.config.id2label

app = Flask(__name__)


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


# Health check
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"ping": "pong"})


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


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=8000)
