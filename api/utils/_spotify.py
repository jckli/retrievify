import os
import base64
import aiohttp


class Spotify:
    def __init__(self):
        client_id = os.environ.get("SPOTIFY_CLIENT_ID")
        client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
        message = f"{client_id}:{client_secret}"
        message_bytes = message.encode("ascii")
        base64_bytes = base64.b64encode(message_bytes)
        self.base64_message = base64_bytes.decode("ascii")
        self.session = aiohttp.ClientSession()

    async def close(self):
        await self.session.close()

    async def get_token(self, code):
        url = "https://accounts.spotify.com/api/token"
        auth = f"Basic {self.base64_message}"
        redirect_uri = os.environ.get("REDIRECT_URI")
        headers = {
            "Authorization": auth,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }
        data = {
            "code": code,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        async with self.session.post(url, headers=headers, data=data) as resp:
            if resp.status == 200:
                return await resp.json()
            else:
                return None

    async def refresh_token(self, refresh_token):
        url = "https://accounts.spotify.com/api/token"
        auth = f"Basic {self.base64_message}"
        headers = {
            "Authorization": auth,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }
        data = {
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }
        async with self.session.post(url, headers=headers, data=data) as resp:
            if resp.status == 200:
                return await resp.json()
            else:
                return None

    async def get_user(self, access_token):
        url = "https://api.spotify.com/v1/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with self.session.get(url, headers=headers) as resp:
            if resp.status == 200:
                return await resp.json()
            elif resp.status == 401:
                return 401
            else:
                return None

    async def get_currently_playing(self, access_token):
        url = "https://api.spotify.com/v1/me/player/currently-playing"
        headers = {"Authorization": f"Bearer {access_token}"}
        async with self.session.get(url, headers=headers) as resp:
            if resp.status == 200:
                return await resp.json()
            elif resp.status == 401:
                return 401
            else:
                return None
