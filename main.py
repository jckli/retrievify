"""
This script runs the Statsify application using a development server.
"""

from os import environ
from Statsify import app
from dotenv import load_dotenv

if __name__ == '__main__':
    load_dotenv()
    app.config.from_pyfile('settings.py')
    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555
    app.run(HOST, PORT, debug=True)