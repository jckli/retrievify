from sanic import response
from .spotify import routes
from .spotify import topitems
from .spotify.tracks import gettrack, audiofeatures
from .spotify.artists import toptracks, relatedartists, getartist


async def index(request):
    return response.json(
        {"status": 200, "message": "Statsify API v1", "link": "https://statsify.hayasaka.moe"}
    )

def add_routes(app):
    app.add_route(index, "/", methods=["GET"], name="index")
    app.add_route(index, "/index", methods=["GET"], name="index2")

    app.blueprint(routes.bp)