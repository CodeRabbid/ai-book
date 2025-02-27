from flask import Blueprint
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMENI_API_KEY = os.getenv('GEMENI_API_KEY')
genai.configure(api_key=GEMENI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

story_api = Blueprint('story_api', __name__)

@story_api.route("/api/story")
def story():
    response = model.generate_content("The opposite of hot is")
    return response.text