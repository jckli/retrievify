from sanic import response

async def index(request):
    return response.json(
        {"message": "Statsify API v1", "link": "https://statsify.hayasaka.moe"}
    )

def add_routes(app):
    app.add_route(index, "/", methods=["GET"], name="index")
    app.add_route(index, "/index", methods=["GET"], name="index2")