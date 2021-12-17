import json
import os
import heapq

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

    # Goes through all the "STREAMING HISTORY" files and places data into arrays
    for i in range(0,len(streamingHistory)):
        print(i)
        abspath = os.path.abspath(dirName + "/" + streamingHistory[i])

        # Opens all files in the list with proper formating
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)

            if(i == 0):
                firstTime = str(data[0]["endTime"][0:10])
            
            # Opens the each "STREAMING HISTORY" file
            for item in data:
                
                # makes a dictionary for every year in songDict
                if currentYear[0:4] != item["endTime"][0:4]:
                    currentYear = item["endTime"][0:10]
                    songDict[currentYear[0:4]] = {}
                    artistDict[currentYear[0:4]] = {}

                # adds every song into the songDict
                # songDict[year][(song, artist)] = time
                songArtist = (item["trackName"], item["artistName"])
                
                songDict[item["endTime"][0:4]][songArtist] = int(item["msPlayed"]) + songDict[item["endTime"][0:4]].get(songArtist,0)
                songDict["Total"][songArtist] = int(item["msPlayed"]) + songDict["Total"].get(songArtist, 0)

                # addes every artist into the artistDict
                # artistDict[year][artist] = time
                artistDict[item["endTime"][0:4]][songArtist[1]] = int(item["msPlayed"]) + artistDict[item["endTime"][0:4]].get(songArtist[1], 0)
                artistDict["Total"][songArtist[1]] = int(item["msPlayed"]) + artistDict["Total"].get(songArtist[1], 0)
            
    print("Finished Receiving Data")

# TOP SONGS
# Returns the time one song is played across all years, songArtist is tuple (song, artist)
def findSongTime(song, artist):
    return songDict["Total"][(song, artist)]

# Returns the time one song is played in a year, songArtist is tuple (song, artist)
def findSongTimeYear(song, artist, year):
    return songDict[year][(song, artist)]

# Returns top songs instances based on listening time across all years
def topSongTime(num):
    list = heapq.nlargest(num, songDict["Total"], key=songDict["Total"].get)
    list2 = []
    for i in range(len(list)):
        list2.append(findSongTime(list[i][0], list[i][1]))
    return list, list2

# Returns top songs instances based on listening time in a year
def topSongTimeYear(year, num):
    return heapq.nlargest(num, songDict[year], key=songDict[year].get)

# TOP ARTISTS
# Returns list of Artist Names from 0 to int
def findArtistTime(artist):
    return artistDict["Total"][artist]

# Returns the time one song is played in of the years
def findArtistTimeYear(artist, year):
    return artistDict[year][artist]

# Returns top songs instances based on listening time across all years
def topArtistTime(num):
    list = heapq.nlargest(num, artistDict["Total"], key=artistDict["Total"].get)
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