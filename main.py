from openai import OpenAI
from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
client = OpenAI()


class PromptModel(BaseModel):
    prompt: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Allows all origins. You can replace "*" with your frontend's origin for security.
    allow_credentials=True,
    allow_methods=[
        "*"
    ],  # Allows all methods. You can specify methods like ["GET", "POST"] for security.
    allow_headers=[
        "*"
    ],  # Allows all headers. You can specify headers like ["Content-Type"] for security.
)


class Prompt(BaseModel):
    prompt: str


@app.post("/generate/")
def generate(prompt: Prompt):
    response = client.images.generate(
        model="dall-e-3",
        prompt="create a coloring book, no color "
        + prompt.prompt
        + "No fill, No solids, vector illustration, –ar 9:11 –v 5",
        size="1024x1024",
        quality="standard",
        n=1,
    )
    image_url = response.data[0].url
    return {"image_url": image_url}
