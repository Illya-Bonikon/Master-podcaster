import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(".env")

client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_TOKEN"),
)

def generate_text(prompt: str, model: str = "gpt-4o-mini", max_tokens: int = 4096, temperature: float = 1, top_p: float = 1) -> str:
    messages = [
        {
            "role": "system",
            "content": "Використовуй лише українські букви та знаки. Напиши подкаст на 100 слів на наступну тему:"
        },
        {
            "role": "user",
            "content": prompt,
        },
    ]

    response = client.chat.completions.create(
        messages=messages,
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=top_p,
    )

    return response.choices[0].message.content

def generate_image_caption(text: str, max_length: int = 70) -> str:
    prompt = (
        f"Write a very short description in English (up to {max_length} characters) to generate an image based on the text:\n\n"
        f"{text}\n\n"
        "The description should be concise and vivid."
    )
    return generate_text(prompt=prompt, max_tokens=50)

def summarize_text(text: str) -> str:
    prompt = (
        "Напиши максимально короткий (до 50 слів) опис українською, про що йдеться в наступному тексті:\n\n"
        f"{text}"
    )
    return generate_text(prompt=prompt, max_tokens=500)
