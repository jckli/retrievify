from audioop import reverse
import json
import os
import heapq
from tkinter import ALL

songDict = {}
artistDict = {}
firstTime = ""
currentYear = ""

# Gets all the files and puts all the songs into classes instances 
# and into lists that contain total time played separated by years
# item["trackName"] item["artistName"] item["endTime"][0:4]
def get_info(dirName):
    # Gets the number of "STREAMING HISTORY" files in the folder
    streamingHistory = []
    for file in os.listdir(dirName):
        if file.startswith("StreamingHistory"):
            streamingHistory.append(file)

    # Makes dictonary for each individual song and artist total time
    songDict["Total"] = {}
    artistDict["Total"] = {}
    currentYear = ""

    # "STREAMING HISTORY" files into arrays
    for i in range(0,len(streamingHistory)):
        print(i)
        abspath = os.path.abspath(dirName + "/" + streamingHistory[i])

        # Opens all files in the list with proper formating
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)

            # Stores First Year
            if(i == 0):
                firstTime = str(data[0]["endTime"][0:10])
            
            # Opens "STREAMING HISTORY" files
            for item in data:
                
                # Dict for each Year
                if currentYear[0:4] != item["endTime"][0:4]:
                    currentYear = item["endTime"][0:10]
                    songDict[currentYear[0:4]] = {}
                    artistDict[currentYear[0:4]] = {}

                # adds every song into the songDict
                # songDict[year][(song, artist)] = [song, artist, ms, Time -max(ms)]
                songArtist = (item["trackName"], item["artistName"])
                    
                if songArtist in songDict[item["endTime"][0:4]]:
                    #Played in Same Year
                    # ms
                    songDict[item["endTime"][0:4]][songArtist]["ms"] = songDict[item["endTime"][0:4]][songArtist]["ms"] + int(item["msPlayed"])
                    songDict["Total"][songArtist]["ms"] = songDict["Total"][songArtist]["ms"] + int(item["msPlayed"])
                    # times
                    if(int(item["msPlayed"]) > songDict["Total"][songArtist]["Time"]):
                        songDict["Total"][songArtist]["Time"] = int(item["msPlayed"])
                        songDict[item["endTime"][0:4]][songArtist]["Time"] = songDict["Total"][songArtist]["Time"]
                            
                elif songArtist in songDict["Total"]:
                    # Played in different year
                    songDict[item["endTime"][0:4]][songArtist] = {"ms": int(item["msPlayed"]), "Time": songDict["Total"][songArtist]["Time"], "Song": item["trackName"], "Artist": item["artistName"]}
                        
                else:
                    # Song Not Played Before
                    songDict[item["endTime"][0:4]][songArtist] = {"ms": int(item["msPlayed"]), "Time": int(item["msPlayed"]), "Song": item["trackName"], "Artist": item["artistName"]}
                    if songArtist not in songDict["Total"]:
                        songDict["Total"][songArtist] = {"ms": int(item["msPlayed"]), "Time": int(item["msPlayed"]), "Song": item["trackName"], "Artist": item["artistName"]}

                # addes every artist into the artistDict
                # artistDict[year][artist] = time
                split = str(item["artistName"]).split(", ")
                for artist in split:

                    if artist in artistDict[item["endTime"][0:4]]:
                        # Add Time
                        artistDict[item["endTime"][0:4]][artist] = artistDict[item["endTime"][0:4]][artist] + int(item["msPlayed"])
                        artistDict["Total"][artist] = artistDict["Total"][artist] + int(item["msPlayed"])
                    elif artist in artistDict["Total"]:
                        # First time in Year
                        artistDict[item["endTime"][0:4]][artist] = int(item["msPlayed"])
                        artistDict["Total"][artist] = artistDict["Total"][artist] + int(item["msPlayed"])
                    else:
                        # First Time Artist is Played
                        artistDict[item["endTime"][0:4]][artist] = int(item["msPlayed"])
                        artistDict["Total"][artist] = artistDict["Total"].get(artist, 0) + int(item["msPlayed"])
            
    print("Finished Receiving Data")

def getMS(dict):
    return dict.get("ms")

# TOP SONGS
# Returns ms of song
def findSongTime(song, artist):
    return songDict["Total"][(song, artist)]["ms"]

# Returns ms of song from Tuples
def findSongTimeTupTotal(songArtist):
    return songDict["Total"][(songArtist[0], songArtist[1])]["ms"]

# Returns ms of song in a year
def findSongTimeYear(song, artist, year):
    return songDict[year][(song, artist)]["ms"]

# Returns top n songs based on listening time across all years  
def topSongTime(num):
    list = heapq.nlargest(num + 1, songDict["Total"], key = findSongTimeTupTotal)
    list.remove(("Unknown Track", "Unknown Artist"))
    list2 = []
    for i in range(len(list)):
        list2.append(findSongTime(list[i][0], list[i][1]))
    return list, list2

# Returns top songs instances based on listening time in a year
#def topSongTimeYear(year, num):

# TOP ARTISTS
# Returns list of Artist Names from 0 to int
def findArtistTime(artist):
    return artistDict["Total"][artist]

# Returns the time one song is played in of the years
def findArtistTimeYear(artist, year):
    return artistDict[year][artist]

# Returns top songs instances based on listening time across all years
def topArtistTime(num):
    list = heapq.nlargest(num + 1, artistDict["Total"], key=artistDict["Total"].get)
    list.remove("Unknown Artist")
    list2 = []
    for i in range(len(list)):
        list2.append(findArtistTime(list[i]))
    return list, list2

# Returns top songs instances based on listening time in a year
def topArtistTimeYear(year, num):
    return heapq.nlargest(num, artistDict[year], key=artistDict[year].get)

# TIME CALCULATIONS
# Returns Total timed listened on spotify in string form (hours:minutes:seconds)
def totalTimeListened():
    a = 0
    for song in songDict["Total"]:
        a = a + int(songDict["Total"][song])
    return a
    
# Returns Total time listened on in a year in string form (hours:minutes:seconds)
def totalTimeListenedInYear(year):
    a = 0
    for song in songDict[year]:
            a = a + int(songDict[year][song])
    return a

# Prints out all the songs
# Prints song name, artist, when it was listened to and the milseconds it was listened for
def printListAllSongs():
    print(songDict)

def getFirstTime():
    return firstTime

def getCurrentYear():
    return currentYear[0:4]