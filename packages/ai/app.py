from flask import Flask
from locale_route import locale_bp
from tagger_route import tagger_bp


app = Flask(__name__)

# Register the blueprints
app.register_blueprint(locale_bp)
app.register_blueprint(tagger_bp)


@app.route("/")
def index():
    return "Welcome to Lenster AI ✨"


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=8000)
