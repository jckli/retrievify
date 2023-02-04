from sanic import Sanic
from src.routes import add_routes

app = Sanic("Statsify")
add_routes(app)

if __name__ == "__main__":
    app.run()