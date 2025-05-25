import os
import uuid

import torch
from TTS.api import TTS

device = "cuda" if torch.cuda.is_available() else "cpu"
tts = TTS("tts_models/uk/mai/vits", gpu=True)
print(f"Using device: {device}")

OUTPUT_DIR = r"D:\kpi\Master-podcaster\backend\media\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_MEDIA_PATH = r"D:\kpi\Master-podcaster\backend\media"

def synthesize_audio(text: str) -> str:
    print(f"Generating audio for text: {text}")
    
    file_name = f"{uuid.uuid4().hex}.wav"
    file_path = os.path.join(OUTPUT_DIR, file_name)

    tts.tts_to_file(text=text, file_path=file_path)
    print(f"Audio saved: {file_path}")

    relative_path = os.path.relpath(file_path, BASE_MEDIA_PATH)
    url_path = f"/media/{relative_path.replace(os.sep, '/')}"
    return url_path
