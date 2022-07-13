import json
import os
import heapq

# TOP SONGS
# Returns the time one song is played across all years, songArtist is tuple (song, artist)
def findSongTime(song, artist, songDict):
    return songDict["Total"][(song, artist)]

# Returns the time one song is played in a year, songArtist is tuple (song, artist)
def findSongTimeYear(song, artist, year, songDict):
    return songDict[year][(song, artist)]

# Returns top songs instances based on listening time across all years
def topSongTime(num, songDict):
    list = heapq.nlargest(num, songDict["Total"], key=songDict["Total"].get)
    list2 = []
    for i in range(len(list)):
        list2.append(findSongTime(list[i][0], list[i][1]))
    return list, list2

# Returns top songs instances based on listening time in a year
def topSongTimeYear(year, num, songDict):
    return heapq.nlargest(num, songDict[year], key=songDict[year].get)

# TOP ARTISTS
# Returns list of Artist Names from 0 to int
def findArtistTime(artist, artistDict):
    return artistDict["Total"][artist]

# Returns the time one song is played in of the years
def findArtistTimeYear(artist, year, artistDict):
    return artistDict[year][artist]

# Returns top songs instances based on listening time across all years
def topArtistTime(num, artistDict):
    list = heapq.nlargest(num, artistDict["Total"], key=artistDict["Total"].get)
    list2 = []
    for i in range(len(list)):
        list2.append(findArtistTime(list[i]))
    return list, list2

# Returns top songs instances based on listening time in a year
def topArtistTimeYear(year, num, artistDict):
    return heapq.nlargest(num, artistDict[year], key=artistDict[year].get)

# TIME CALCULATIONS
# Returns Total timed listened on spotify in string form (hours:minutes:seconds)
def totalTimeListened(songDict):
    a = 0
    for year in songDict["Total"]["All"]:
        a = a + int(songDict["Total"][year])
    return a
    
# Returns Total time listened on in a year in string form (hours:minutes:seconds)
def totalTimeListenedInYear(year, songDict):
    a = 0
    for song in songDict[year]:
        a = a + int(songDict[year][song])
    return a

# Prints out all the songs
# Prints song name, artist, when it was listened to and the milseconds it was listened for
def printListAllSongs(songDict):
    print(songDict)

def getFirstTime(firstTime):
    return firstTime

def getCurrentYear(currentYear):
    return currentYear[0:4]