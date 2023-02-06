from ..utils._spotify import Spotify
from sanic import response


async def get_user(request):
    no_access = response.json({"status": 401, "message": "No access"})
    body = request.json
    if body is None:
        return no_access
    if body.get("refresh_token") is None:
        return no_access
    access_token = body.get("access_token")
    spotify = Spotify()
    if access_token is None:
        return await get_user_refresh(spotify, body.get("refresh_token"))
    user_resp = await spotify.get_user(access_token)
    resp = response.json({"status": 200, "data": user_resp})
    if user_resp is None:
        await spotify.close()
        return response.json({"status": 404, "message": "No data"})
    elif user_resp == 401:
        return await get_user_refresh(spotify, body.get("refresh_token"))
    await spotify.close()
    return resp


async def get_user_refresh(spotify, refresh_token):
    no_access = response.json({"status": 401, "message": "No access"})
    ref = await spotify.refresh_token(refresh_token)
    if "error" in ref:
        await spotify.close()
        return no_access
    access_token = ref.get("access_token")
    user_resp = await spotify.get_user(access_token)
    resp = response.json(
        {
            "status": 201,
            "data": user_resp,
            "access_token": access_token,
            "expires_in": ref.get("expires_in"),
        }
    )
    await spotify.close()
    return resp
