from sanic import Sanic
from sanic.response import json

app = Sanic()

@app.route("/")
async def index(request, path=""):
    return json({"hello": path})
