from ..index import app
from ..utils._spotify import Spotify
from sanic import response
import aiohttp


@app.route("/api/spotify/currentlyplaying")
async def currently_playing(request):
    no_access = response.json({"error": {"status": 401, "message": "No access"}})
    if (
        not request.cookies.get("acct")
        or not request.cookies.get("reft")
        or not request.cookies.get("exp")
    ):
        return no_access
    access_token = request.cookies.get("acct")
    spotify = Spotify()
    user_resp = await spotify.get_currently_playing(access_token)
    resp = response.json(user_resp)
    if user_resp is None:
        return response.redirect("/api/login")
    elif user_resp == 401:
        ref = await spotify.refresh_token(request.cookies.get("reft"))
        if "error" in ref:
            await spotify.close()
            return response.redirect("/api/login")
        access_token = ref["access_token"]
        user_resp = await spotify.get_currently_playing(access_token)
        resp = response.json(user_resp)
        resp.cookies["acct"] = access_token
        resp.cookies["reft"] = ref["refresh_token"]
        resp.cookies["exp"] = str(ref["expires_in"])
    await spotify.close()

    return resp
