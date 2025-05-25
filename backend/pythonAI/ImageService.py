import os
import uuid

import torch
from diffusers import StableDiffusionPipeline

model_id = "runwayml/stable-diffusion-v1-5"
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
torch.cuda.empty_cache()

pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
)
pipe.enable_attention_slicing()
pipe = pipe.to(device)

OUTPUT_DIR = r"D:\kpi\Master-podcaster\backend\media\image"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_MEDIA_PATH = r"D:\kpi\Master-podcaster\backend\media"

def generate_image(prompt: str) -> str:
    print(f"Generating image for prompt: {prompt}")

    image = pipe(prompt).images[0]

    file_name = f"{uuid.uuid4().hex}.png"
    file_path = os.path.join(OUTPUT_DIR, file_name)

    image.save(file_path)
    print(f"Image saved: {file_path}")

    relative_path = os.path.relpath(file_path, BASE_MEDIA_PATH)
    url_path = f"/media/{relative_path.replace(os.sep, '/')}"
    return url_path
