from .index import app
from .utils._spotify import Spotify
from sanic import response


@app.route("/api/refresh")
async def refresh_token(request):
    no_access = response.json({"error": {"status": 401, "message": "No access"}})
    if not request.cookies.get("acct"):
        return no_access
    if not request.cookies.get("reft"):
        return no_access
    if not request.cookies.get("exp"):
        return no_access
    refresh_token = request.cookies.get("reft")
    expires_in = int(request.cookies.get("exp"))
    if expires_in > 0:
        return response.json({"error": {"status": 401, "message": "Not expired"}})
    spotify = Spotify()
    token_resp = await spotify.refresh_token(refresh_token)
    if token_resp is None:
        return response.redirect("/api/login")
    resp = response.json(
        {
            "data": {
                "status": 200,
                "access_token": token_resp["access_token"],
                "expires_in": token_resp["expires_in"],
                "refresh_token": token_resp["refresh_token"],
            }
        }
    )
    resp.cookies["acct"] = token_resp["access_token"]
    resp.cookies["reft"] = token_resp["refresh_token"]
    resp.cookies["exp"] = str(token_resp["expires_in"])
    return resp
