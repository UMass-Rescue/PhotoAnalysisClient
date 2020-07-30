from flask import Flask
import os

app = Flask(__name__)

try:
    port = int(os.environ['BACKEND_PORT'])
except Exception as e:
    port = 5000

@app.route("/")
def home_route():
    return "hello world"

if __name__ == "__main__":
    try:
        if os.environ['ENVIRONMENT'] == 'debug':
            app.run(port=port, debug=True)
    except KeyError as e:
        app.run(port=port, debug=False)
