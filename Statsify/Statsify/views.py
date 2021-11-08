"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from Statsify import app

@app.route('/')
def home():
    """Renders the home page."""
    return render_template(
        'index.html'
    )