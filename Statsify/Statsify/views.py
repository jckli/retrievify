"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, session, make_response, redirect, current_app
import os
from urllib.parse import urlencode
from Statsify import app
import secrets

@app.route('/')
def home():
    """Renders the home page."""
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
    return "yo"