from os import environ
from Statsify import app
from cheroot.wsgi import Server as WSGIServer, PathInfoDispatcher
from dotenv import load_dotenv

if __name__ == '__main__':
    load_dotenv()
    app.config.from_pyfile('settings.py')
    HOST = environ.get('SERVER_HOST', 'localhost')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555

    d = PathInfoDispatcher({'/': app})
    server = WSGIServer((HOST, PORT), d, numthreads=2)
    server.start()