import torch
from flask import Blueprint, jsonify, request
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Create a Blueprint instance
locale_bp = Blueprint("locale", __name__)

# Initialize the locale model
locale_hf = "models/locale_detector"
locale_tokenizer = AutoTokenizer.from_pretrained(locale_hf)
locale_model = AutoModelForSequenceClassification.from_pretrained(locale_hf)
locale_class_mapping = locale_model.config.id2label


def predictLocale(text):
    tokens = locale_tokenizer(text, return_tensors="pt")
    output = locale_model(**tokens)
    predictions = torch.nn.functional.softmax(output.logits, dim=-1)
    _, preds = torch.max(predictions, dim=-1)

    return locale_class_mapping[preds.item()]


@locale_bp.route("/locale", methods=["POST"])
def locale():
    data = request.get_json()
    text = data["text"]

    if len(text.split()) > 4:
        locale_scores = predictLocale(text)
        return jsonify({"locale": locale_scores})
    else:
        return jsonify({"locale": None})
