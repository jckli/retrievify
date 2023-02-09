from sanic import Sanic
from sanic_ext import Extend
from src.routes import add_routes

app = Sanic("Statsify")
app.config.CORS_ORIGINS = [
    "http://localhost:3000",
    "https://statsify.hayasaka.moe",
    "https://sbeta.hayasaka.moe",
    "https://statsify-beta.vercel.app",
]
add_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
