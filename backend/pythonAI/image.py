import torch
from diffusers import StableDiffusionPipeline

# Встав свій токен сюди:
access_token = "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"

model_id = "runwayml/stable-diffusion-v1-5"

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

pipe = StableDiffusionPipeline.from_pretrained(model_id, use_auth_token=access_token)
pipe = pipe.to(device)

prompt = "Code, crypto and coffee: how programmers are changing the world"

image = pipe(prompt).images[0]

image.save("test_sd_image.png")
print("Image saved as test_sd_image.png")
