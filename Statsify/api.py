import os
import requests
import base64
import asyncio
from flask import session

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

def refreshToken(refresh_token):
	url = 'https://accounts.spotify.com/api/token'
	authorization = "Basic " + base64Message
	redirect_uri = os.environ.get("REDIRECT_URI")
	headers = {'Authorization': authorization, 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}
	data = {'refresh_token': refresh_token, 'grant_type': 'refresh_token'}
	post_response = requests.post(url, headers=headers, data=data)
	if post_response.status_code == 200:
		json = post_response.json()
		return json['access_token'], json['expires_in']
	else:
		print('refreshToken:' + str(post_response.status_code))
		return None

def getUserInfo(token):
	url = 'https://api.spotify.com/v1/me'
	headers = {'Authorization': 'Bearer ' + token}
	get_response = requests.get(url, headers=headers)
	if get_response.status_code == 200:
		json = get_response.json()
		return json
	elif get_response.status_code == 401:
		refresh = refreshToken(session["refresh_token"])
		session["token"] = refresh[0]
		session["expires_in"] = refresh[1]
		return getUserInfo(refresh[0])
	else:
		print('getUserInfo:' + str(get_response.status_code))
		return None
	
def getCurrentlyPlaying(token):
	url = 'https://api.spotify.com/v1/me/player/currently-playing'
	headers = {'Authorization': 'Bearer ' + token}
	get_response = requests.get(url, headers=headers)
	if get_response.status_code == 200:
		json = get_response.json()
		return json
	elif get_response.status_code == 401:
		refresh = refreshToken(session["refresh_token"])
		session["token"] = refresh[0]
		session["expires_in"] = refresh[1]
		return getUserInfo(refresh[0])
	else:
		print('getCurrentlyPlaying:' + str(get_response.status_code))
		

def getTopArtists(token, timeRange, limit, offset):
	url = f'https://api.spotify.com/v1/me/top/artists?time_range={timeRange}&limit={limit}&offset={offset}'
	headers = {'Authorization': 'Bearer ' + token}
	get_response = requests.get(url, headers=headers)
	if get_response.status_code == 200:
		json = get_response.json()
		return json
	elif get_response.status_code == 401:
		refresh = refreshToken(session["refresh_token"])
		session["token"] = refresh[0]
		session["expires_in"] = refresh[1]
		return getUserInfo(refresh[0])
	else:
		print('getTopArtists:' + str(get_response.status_code))
		return None

def getTopSongs(token, timeRange, limit, offset):
	url = f'https://api.spotify.com/v1/me/top/tracks?time_range={timeRange}&limit={limit}&offset={offset}'
	headers = {'Authorization': 'Bearer ' + token}
	get_response = requests.get(url, headers=headers)
	if get_response.status_code == 200:
		json = get_response.json()
		return json
	elif get_response.status_code == 401:
		refresh = refreshToken(session["refresh_token"])
		session["token"] = refresh[0]
		session["expires_in"] = refresh[1]
		return getUserInfo(refresh[0])
	else:
		print('getTopSongs:' + str(get_response.status_code))
		return None

async def checkChangesinCP(token, cp):
	while True:
		cp_new = getCurrentlyPlaying(token)
		if cp_new is not None:
			if cp_new["id"] != cp["id"]:
				cp = cp_new
				return cp
		await asyncio.sleep(5)