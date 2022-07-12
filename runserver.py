"""
This script runs the Statsify application using a development server.
"""

from os import environ
from Statsify import app
from dotenv import load_dotenv

load_dotenv()

if __name__ == '__main__':
    app.config.from_pyfile('settings.py')
    app.secret_key = environ.get("SECRET_KEY")
    HOST = environ.get('SERVER_HOST', 'localhost')
    DEBUG=False
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT, DEBUG, threaded=True)
