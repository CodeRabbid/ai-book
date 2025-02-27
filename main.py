from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="frontend/dist", static_url_path="/")

@app.route("/")
def frontend():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/image")
def image():
    return "image"

if __name__ == "__main__":
    app.run()
