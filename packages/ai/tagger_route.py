from flask import Blueprint, jsonify, request
from scipy.special import expit
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Create a Blueprint instance
tagger_bp = Blueprint("tagger", __name__)

# Initialize the tagger model
topic_hf = "models/tagger"
topic_tokenizer = AutoTokenizer.from_pretrained(topic_hf)
topic_model = AutoModelForSequenceClassification.from_pretrained(topic_hf)
topic_class_mapping = topic_model.config.id2label


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

    # Extract the top two topics
    top_topics = [topic_score["topic"] for topic_score in topic_scores[:1]]

    return top_topics


@tagger_bp.route("/tagger", methods=["POST"])
def tagger():
    data = request.get_json()
    text = data["text"]

    if len(text.split()) > 4:
        topics = predictTopic(text)
        return jsonify({"topics": topics})
    else:
        return jsonify({"topics": None})
