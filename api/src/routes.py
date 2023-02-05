from sanic import response
from .spotify import currentlyplaying, getuser
from .spotify import topitems


async def index(request):
    return response.json(
        {"message": "Statsify API v1", "link": "https://statsify.hayasaka.moe"}
    )

def add_routes(app):
    app.add_route(index, "/", methods=["GET"], name="index")
    app.add_route(index, "/index", methods=["GET"], name="index2")
    app.add_route(currentlyplaying.currently_playing, "/spotify/currentlyplaying", methods=["POST"], name="currently_playing")
    app.add_route(getuser.get_user, "/spotify/getuser", methods=["POST"], name="get_user")

    app.add_route(topitems.top_items, "/spotify/topitems/<type>", methods=["POST"], name="top_items")
    