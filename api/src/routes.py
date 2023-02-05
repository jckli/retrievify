from sanic import response
from .spotify import currentlyplaying, getuser
from .spotify import topitems
from .spotify.tracks import gettrack, audiofeatures
from .spotify.artists import toptracks, relatedartists, getartist


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
    app.add_route(gettrack.get_track, "/spotify/tracks/<id>", methods=["POST"], name="get_track")
    app.add_route(audiofeatures.get_track_audio_features, "/spotify/tracks/<id>/audiofeatures", methods=["POST"], name="get_track_audio_features")
    app.add_route(getartist.get_artist, "/spotify/artists/<id>", methods=["POST"], name="get_artist")
    app.add_route(toptracks.get_artist_top_tracks, "/spotify/artists/<id>/toptracks", methods=["POST"], name="get_artist_top_tracks")
    app.add_route(relatedartists.get_artist_related_artists, "/spotify/artists/<id>/relatedartists", methods=["POST"], name="get_related_artists")