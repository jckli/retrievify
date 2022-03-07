"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, session, make_response, redirect, flash, request, jsonify
from Statsify import api
import os
from urllib.parse import urlencode
from Statsify import app
import secrets
from collections import Counter

@app.route('/')
def home():
    return render_template(
        'index.html'
    )

@app.route("/login")
def login():
    authorize_url = 'https://accounts.spotify.com/en/authorize?'
    client_id = os.environ.get("SPOTIFY_CLIENT_ID")
    scope = os.environ.get("SCOPE")
    redirect_uri = os.environ.get("REDIRECT_URI")
    state_key = secrets.token_urlsafe(15)
    session['state_key'] = state_key
    params = {'response_type': 'code', 'client_id': client_id,
            'redirect_uri': redirect_uri, 'scope': scope, 
            'state': state_key}
    query_params = urlencode(params)
    response = make_response(redirect(authorize_url + query_params))
    return response

@app.route("/callback")
def callback():
    if request.args.get("state") != session["state_key"]:
        return render_template("index.html", error="State failed.")
    if request.args.get("error"):
        return render_template("index.html", error="Error")
    else:
        code = request.args.get("code")
        tokenRaw = api.getToken(code)
        if tokenRaw is None:
            flash(u'You did not sign in. Please try again.')
            return redirect("/")
        elif tokenRaw != None:
            session["token"] = tokenRaw[0]
            session["refresh_token"] = tokenRaw[1]
            session["token_expire"] = tokenRaw[2]
            return redirect("/home")

@app.route("/home")
def main():
    userInfo = api.getUserInfo(session["token"])
    userpfp = userInfo["images"][0]["url"]
    userName = userInfo["display_name"]
    
    # add local song functionality
    currentlyPlaying = api.getCurrentlyPlaying(session["token"])
    session["orig_cp"] = currentlyPlaying

    if currentlyPlaying is not None:
        class cp:
            title = currentlyPlaying["item"]["name"]
            artistsRaw = [artist["name"] for artist in currentlyPlaying["item"]["artists"]]
            artists = ", ".join(artistsRaw)
            cover = currentlyPlaying["item"]["album"]["images"][0]["url"]
            album = currentlyPlaying["item"]["album"]["name"]
    else:
        cp = None

    topArtists = api.getTopArtists(session["token"], "short_term", 100, 0)
    ta = topArtists["items"][:10]

    topTracks = api.getTopSongs(session["token"], "short_term", 10, 0)
    
    tt = topTracks["items"]
    topTracksArtists = []
    for track in tt:
        artistsRaw = []
        for artist in track["artists"]:
            artistsRaw.append(artist["name"])
        ttArtists = ", ".join(artistsRaw)
        topTracksArtists.append(ttArtists)

    # do something with genres someday
    genreRaw = []
    for artist in topArtists["items"]:
        for genre in artist["genres"]:
            genreRaw.append(genre)
    cnt = Counter()
    for genre in genreRaw:
        cnt[genre] += 1
    genremc = cnt.most_common(10)
    sortedGenres = []
    for key, value in genremc:
        sortedGenres.append(key)
    topgenres = sortedGenres[:5]

    return render_template('home.html', **locals())

@app.route("/ajax")
def ajax():
    return jsonify({"error": "Invalid request"})

@app.route("/ajax/top_songs", methods=["GET"])
def ajax_topsongs():
    if request.args.get("type") == "current":
        try:
            topTracks = api.getTopSongs(session["token"], "short_term", 10, 0)
        except:
            return jsonify({"error": "Invalid token"})
    elif request.args.get("type") == "six-month":
        try:   
            topTracks = api.getTopSongs(session["token"], "medium_term", 10, 0)
        except:
            return jsonify({"error": "Invalid token"})
    elif request.args.get("type") == "all-time":
        try:
            topTracks = api.getTopSongs(session["token"], "long_term", 10, 0)
        except:
            return jsonify({"error": "Invalid token"})
    else:
        return jsonify({"error": "Invalid request"})
    tt = topTracks["items"]
    topTracksArtists = []
    for track in tt:
        artistsRaw = []
        for artist in track["artists"]:
            artistsRaw.append(artist["name"])
        ttArtists = ", ".join(artistsRaw)
        topTracksArtists.append(ttArtists)
    tracks = {"tracks": []}
    for i in range(len(tt)):
        tracks["tracks"].append({"name": tt[i]["name"], "artists": topTracksArtists[i], "image": tt[i]["album"]["images"][0]["url"]})
    return jsonify(tracks)

@app.route("/ajax/top_artists", methods=["GET"])
def ajax_topartists():
    if request.args.get("type") == "current":
        try:
            topTracks = api.getTopArtists(session["token"], "short_term", 10, 0)
        except:
            return jsonify({"error": "Invalid token"})
    elif request.args.get("type") == "six-month":
        try:
            topTracks = api.getTopArtists(session["token"], "medium_term", 10, 0)
        except:
            return jsonify({"error": "Invalid token"})
    elif request.args.get("type") == "all-time":
        try:
            topTracks = api.getTopArtists(session["token"], "long_term", 10, 0)
        except:
            return jsonify({"error": "Invalid token"})
    else:
        return jsonify({"error": "Invalid request"})
    ta = topTracks["items"]
    return jsonify(ta)

@app.route("/ajax/currently_playing", methods=["GET"])
def ajax_currentlyplaying():
    if request.args.get("type") == "now":
        try:
            currentlyPlaying = api.getCurrentlyPlaying(session["token"])
        except:
            return jsonify({"error": "Invalid token"})
    elif request.args.get("type") == "original":
        try:
            currentlyPlaying = session["orig_cp"]
        except:
            return jsonify({"error": "Something went wrong"})
    else:
        return jsonify({"error": "Invalid request"})
    cp = currentlyPlaying
    return jsonify(cp)

@app.route("/dpe")
def dpe():
    userInfo = api.getUserInfo(session["token"])
    userpfp = userInfo["images"][0]["url"]
    userName = userInfo["display_name"]

    return render_template("datapackage.html", **locals())

@app.route("/ajax/upload", methods=["POST"])
def dpe_upload():
    if request.method == "POST":
        if "file" not in request.files:
            return jsonify({"status": "No file part"})
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"status": "No file selected"})
        if file:
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], file.filename))
            return jsonify({"status": "File uploaded successfully"})
        else:
            return jsonify({"status": "Invalid file"})
    else:
        return jsonify({"error": "Invalid request"})