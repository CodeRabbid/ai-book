from flask import Blueprint
import os
from dotenv import load_dotenv

load_dotenv()

story_api = Blueprint('story_api', __name__)

@story_api.route("/api/story")
def story():
    return "story"