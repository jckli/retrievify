from ..index import app
from ..utils._spotify import Spotify
from sanic import response


@app.route("/api/spotify/recommendations")
async def top_items(request):
    no_access = response.json({"error": {"status": 401, "message": "No access"}})
    if (
        not request.cookies.get("acct")
        or not request.cookies.get("reft")
        or not request.cookies.get("exp")
    ):
        return no_access
    access_token = request.cookies.get("acct")
    seed_artists = request.args.get("seed_artists")
    seed_tracks = request.args.get("seed_tracks")
    seed_genres = request.args.get("seed_genres")
    limit = request.args.get("limit")
    market = request.args.get("market")
    spotify = Spotify()
    user_resp = await spotify.get_recommendations(
        access_token, seed_artists, seed_tracks, seed_genres, limit, market
    )
    print(user_resp)
    resp = response.json(user_resp)
    await spotify.close()

    return resp
