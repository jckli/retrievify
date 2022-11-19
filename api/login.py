from .index import app
from sanic import response
import os
import secrets
import urllib


@app.route("/api/login")
async def login(request):
    authorize_url = "https://accounts.spotify.com/en/authorize?"
    client_id = os.environ.get("SPOTIFY_CLIENT_ID")
    scope = os.environ.get("SCOPE")
    redirect_uri = os.environ.get("REDIRECT_URI")
    state_key = secrets.token_urlsafe(15)
    request.cookies["state_key"] = state_key
    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": scope,
        "state": state_key,
    }
    return response.redirect(authorize_url + urllib.parse.urlencode(params))
