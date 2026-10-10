"""Helper for talking to Gemma 4 through the Gemini API.

This is the ONLY file that talks to the API. The app never builds its own
client — it always calls ask(), ask_with_image() or make_chat() from here.

Model: gemma-4-26b-a4b-it (do not change).
API key: read from the GEMINI_API_KEY environment variable (loaded from .env).
"""

import os

from dotenv import load_dotenv
from google import genai

# Load variables from a local .env file (which is git-ignored).
load_dotenv()

MODEL = "gemma-4-26b-a4b-it"


def _client() -> genai.Client:
    """Create a Gemini API client using the key from the environment."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and paste your key."
        )
    return genai.Client(api_key=api_key)


def ask(prompt: str) -> str:
    """Send one text prompt to Gemma 4 and return the text answer."""
    response = _client().models.generate_content(model=MODEL, contents=prompt)
    return response.text


def ask_with_image(prompt: str, image_bytes: bytes, mime_type: str = "image/png") -> str:
    """Send a prompt plus one image (e.g. an event poster) to Gemma 4."""
    from google.genai import types

    image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    response = _client().models.generate_content(
        model=MODEL, contents=[prompt, image_part]
    )
    return response.text


def make_chat(system_instruction: str = ""):
    """Create a multi-turn chat session with Gemma 4.

    Returns a chat object; send messages with chat.send_message("...").
    """
    from google.genai import types

    config = (
        types.GenerateContentConfig(system_instruction=system_instruction)
        if system_instruction
        else None
    )
    return _client().chats.create(model=MODEL, config=config)
