from sanic import Sanic, response
import os

app = Sanic("Statsify")


@app.route("/api")
@app.route("/api/index")
async def index(request):
    return response.json(
        {"Hey!": "This is the Statsify API. Please go back to the main website."}
    )
