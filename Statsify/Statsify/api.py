import os
import requests
import base64

clientid = os.environ.get("SPOTIFY_CLIENT_ID")
clientSecret = os.environ.get("SPOTIFY_CLIENT_SECRET")
message = f"{clientid}:{clientSecret}"
messageBytes = message.encode("ascii")
base64Bytes = base64.b64encode(messageBytes)
base64Message = base64Bytes.decode("ascii")

def getToken(code):
	url = 'https://accounts.spotify.com/api/token'
	authorization = "Basic " + base64Message
	redirect_uri = os.environ.get("REDIRECT_URI")
	headers = {'Authorization': authorization, 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
	data = {'code': code, 'redirect_uri': redirect_uri, 'grant_type': 'authorization_code'}
	post_response = requests.post(url, headers=headers, data=data)
	if post_response.status_code == 200:
		json = post_response.json()
		return json['access_token'], json['refresh_token'], json['expires_in']
	else:
		print('getToken:' + str(post_response.status_code))
		return None

def getUserInfo(token):
	url = 'https://api.spotify.com/v1/me'
	headers = {'Authorization': 'Bearer ' + token}
	get_response = requests.get(url, headers=headers)
	if get_response.status_code == 200:
		json = get_response.json()
		return json
	else:
		print('getUserInfo:' + str(get_response.status_code))
		return None