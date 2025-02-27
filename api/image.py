from flask import Blueprint

image_api = Blueprint('image_api', __name__)

@image_api.route("/api/image")
def accountList():
    return "image"