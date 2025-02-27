from flask import Flask, send_from_directory
from api.image import image_api
from api.story import story_api

app = Flask(__name__, static_folder="frontend/dist", static_url_path="/")

app.register_blueprint(image_api)
app.register_blueprint(story_api)

@app.route("/")
def frontend():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run()
