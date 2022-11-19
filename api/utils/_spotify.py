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

    async def close(self):
        await self.session.close()
