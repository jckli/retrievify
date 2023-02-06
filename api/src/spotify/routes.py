from sanic import Blueprint, response
from . import currentlyplaying, getuser, topitems, tracks, artists

bp = Blueprint("Spotify", url_prefix="/spotify")

@bp.route("/")
async def spotify_index(request):
    return response.json({"status": 200, "message": "Statsify API v1 - Spotify Module", "link": "https://statsify.hayasaka.moe"})

@bp.route("/currentlyplaying")
async def currently_playing(request):
    return await currentlyplaying.currently_playing(request)

@bp.route("/getuser")
async def get_user(request):
    return await getuser.get_user(request)

@bp.route("/topitems/<type>")
async def top_items(request, type: str):
    return await topitems.top_items(request, type)

@bp.route("/tracks/<id>")
async def get_track(request, id: str):
    return await tracks.get_track(request, id)

@bp.route("/tracks/<id>/audiofeatures")
async def get_track_audio_features(request, id: str):
    return await tracks.get_track_audio_features(request, id)

@bp.route("/artists/<id>")
async def get_artist(request, id: str):
    return await artists.get_artist(request, id)

@bp.route("/artists/<id>/toptracks")
async def get_artist_top_tracks(request, id: str):
    return await artists.get_artist_top_tracks(request, id)

@bp.route("/artists/<id>/relatedartists")
async def get_related_artists(request, id: str):
    return await artists.get_artist_related_artists(request, id)
