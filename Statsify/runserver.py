"""
This script runs the Statsify application using a development server.
"""

from os import environ
from Statsify import app
from dotenv import load_dotenv

if __name__ == '__main__':
    app.config.from_pyfile('settings.py')
    app.secret_key = "6upNRfAhgf5sL1SW7KOIGDngu4cJ7gas"
    HOST = environ.get('SERVER_HOST', 'localhost')
    DEBUG=True
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT, DEBUG)
