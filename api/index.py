from sanic import Sanic
from sanic.response import json

app = Sanic("Statsify")

@app.route('/')
async def index(request):
    return json({"hello": "world"})