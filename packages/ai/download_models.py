import os
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

if os.path.isdir("models/tagger") and os.listdir("models/tagger"):
    print("tagger model already downloaded.")
else:
    tagger_hf = "yo/tagger"
    tagger_tokenizer = AutoTokenizer.from_pretrained(tagger_hf)
    tagger = AutoModelForSequenceClassification.from_pretrained(tagger_hf)
    tagger_class_mapping = tagger.config.id2label
    tagger.save_pretrained("models/tagger")
    tagger_tokenizer.save_pretrained("models/tagger")
    print("tagger model downloaded.")

if os.path.isdir("models/locale_detector") and os.listdir("models/locale_detector"):
    print("locale_detector model already downloaded.")
else:
    locale_detector_hf = "yo/locale-detector"
    locale_detector_tokenizer = AutoTokenizer.from_pretrained(locale_detector_hf)
    locale_detector = AutoModelForSequenceClassification.from_pretrained(
        locale_detector_hf
    )
    locale_detector_class_mapping = locale_detector.config.id2label
    locale_detector.save_pretrained("models/locale_detector")
    locale_detector_tokenizer.save_pretrained("models/locale_detector")
    print("locale_detector model downloaded.")
