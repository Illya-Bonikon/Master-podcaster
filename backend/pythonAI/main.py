import threading

from AudioService import synthesize_audio
from flask import Flask, jsonify, request
from ImageService import generate_image
from TextService import generate_image_caption, generate_text, summarize_text

app = Flask(__name__)

# Лок для синхронізації
lock = threading.Lock()

@app.route('/generate-image', methods=['POST'])
def generate_image_route():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({"error": "Missing 'text' parameter"}), 400

    with lock:
        image_caption = generate_image_caption(text)
        image_path = generate_image(image_caption)

    return jsonify({
        "image_path": image_path
    })

@app.route('/generate-audio-summary', methods=['POST'])
def generate_audio_summary_route():
    data = request.json
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Missing 'prompt' parameter"}), 400

    with lock:
        text = generate_text(prompt)
        audio_path = synthesize_audio(text)
        summary = summarize_text(text)

    return jsonify({
        "summary": summary,
        "audio_path": audio_path
    })

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
