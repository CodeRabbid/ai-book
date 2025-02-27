from flask import Blueprint
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

image_api = Blueprint('image_api', __name__)

@image_api.route("/api/image")
def accountList():
    client = OpenAI(api_key = OPENAI_API_KEY)

    response = client.images.generate(
        model="dall-e-3",
        prompt="story about a princess being chased by a dragon",
        size="1024x1024",
        quality="standard",
        n=1,
    )

    return response.data[0].url