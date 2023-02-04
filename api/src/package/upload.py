from ..index import app
from ..utils._spotify import Spotify
from sanic import response
import zipfile
import io
import os
import asyncpg
from ..utils._parsepackage import get_info


@app.route("/api/package/upload", methods=["POST"])
async def upload(request):
    if "file" not in request.files:
        return response.json(
            {"error": {"status": 400, "message": "No file provided"}}, status=400
        )
    if not request.files["file"][0].name.endswith(".zip"):
        return response.json(
            {"error": {"status": 400, "message": "Invalid file type"}}, status=400
        )
    if not request.files["file"][0].body:
        return response.json(
            {
                "error": {
                    "status": 400,
                    "message": "Invalid file",
                }
            },
            status=400,
        )
    conn = await asyncpg.connect(
        user=os.environ.get("POSTGRE_USER"),
        password=os.environ.get("POSTGRE_PASSWORD"),
        database=os.environ.get("POSTGRE_DB"),
        host=os.environ.get("POSTGRE_HOST"),
    )
    values = await conn.fetch(
        "SELECT * FROM packages WHERE name = $1", request.form["name"][0]
    )
    await conn.close()
    file = request.files["file"][0]
    zf = zipfile.ZipFile(io.BytesIO(file.body), "r")
    try:
        dp = get_info(zf)
    except Exception as e:
        return response.json(
            {"error": {"status": 400, "message": "Invalid package"}}, status=400
        )
    zf.close()
    resp = response.json(
        {
            "songDict": dp[0],
            "artistDict": dp[1],
            "firstTime": dp[2],
            "currentYear": dp[3],
        },
        status=200,
    )
    return resp
