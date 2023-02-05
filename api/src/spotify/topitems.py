from ..utils._spotify import Spotify
from sanic import response


async def top_items(request, type: str):
    no_access = response.json({"status": 401, "message": "No access"})
    body = request.json
    time_range = request.args.get("time_range")
    limit = request.args.get("limit")
    if body is None:
        return no_access
    if ((body.get("access_token") is None) or (body.get("refresh_token") is None)):
        return no_access
    access_token = body.get("access_token")
    spotify = Spotify()
    user_resp = await spotify.get_top_items(access_token, type, time_range, limit)
    resp = response.json({"status": 200, "data": user_resp})
    if user_resp is None:
        await spotify.close()
        return response.json({"status": 404, "message": "No data"})
    elif user_resp == 401:
        ref = await spotify.refresh_token(body.get("refresh_token"))
        if "error" in ref:
            await spotify.close()
            return no_access
        access_token = ref.get("access_token")
        user_resp = await spotify.get_top_items(access_token, type, time_range, limit)
        resp = response.json({"status": 201, "data": user_resp, "access_token": access_token, "expires_in": ref["expires_in"]})
    await spotify.close()
    return resp