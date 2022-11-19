from .index import app
from .utils._spotify import Spotify
from sanic import response


@app.route("/api/callback")
async def callback(request):
    spotify = Spotify()
    if request.args.get("error"):
        return response.json({"Error": request.args.get("error")})
    state = request.args.get("state")
    if state != request.cookies.get("state_key"):
        return response.json({"Error": "Invalid state key."})
    code = request.args.get("code")
    token_resp = await spotify.get_token(code)
    if token_resp is None:
        return response.json({"Error": "No token response."})
    access_token = token_resp["access_token"]
    refresh_token = token_resp["refresh_token"]
    expires_in = token_resp["expires_in"]
    await spotify.close()
    resp = response.redirect("/home")
    del resp.cookies["state_key"]
    resp.cookies["acct"] = access_token
    resp.cookies["reft"] = refresh_token
    resp.cookies["exp"] = str(expires_in)
    return resp
