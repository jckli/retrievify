"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, session, make_response, redirect, flash, request
from Statsify import api
import os
from urllib.parse import urlencode
from Statsify import app
import secrets

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

    currentlyPlaying = api.getCurrentlyPlaying(session["token"])
    class cp:
        title = currentlyPlaying["item"]["name"]
        artistsRaw = []
        for artist in currentlyPlaying["item"]["artists"]:
            artistsRaw.append(artist["name"])
        artists = ", ".join(artistsRaw)
        cover = currentlyPlaying["item"]["album"]["images"][0]["url"]
        album = currentlyPlaying["item"]["album"]["name"]

    topArtists = api.getTopArtists(session["token"], "long_term", 10, 0)
    ta = topArtists["items"]

    return render_template('home.html', **locals())