from flask import Blueprint, request
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

image_api = Blueprint('image_api', __name__)

@image_api.route("/api/image", methods=['POST'])
def image():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        body = request.json
        if body["theme"]: 
            client = OpenAI(api_key = OPENAI_API_KEY) 
            # response = client.images.generate(
            #     model="dall-e-3",
            #     prompt=f'story about {body["theme"]}',
            #     size="1024x1024",
            #     quality="standard",
            #     n=1,
            # )
            
            # return response.data[0].url
            return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-VHMaJBvjZNuGTFmu7edv1953/user-FEnGpcuk5Ua7PXi1b0kXlVG2/img-eVTgxEnzkm3ngOUwtcKjAqyD.png?st=2025-02-27T19%3A36%3A05Z&se=2025-02-27T21%3A36%3A05Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-02-27T11%3A16%3A58Z&ske=2025-02-28T11%3A16%3A58Z&sks=b&skv=2024-08-04&sig=rDaL9bCgd7M8lw19xsj6YrxO8eMBAcMIAP2s0EjT7Lc%3D"