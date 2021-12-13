import json
import os
import heapq

songDict = {}
artistDict = {}

# Gets all the files and puts all the songs into classes instances 
# and into lists that contain total time played separated by years
#item["trackName"] item["artistName"] and item["endTime"][0:4]
def get_info(dirName):
    # Gets the number of "STREAMING HISTORY" files in the folder
    streamingHistory = []
    for file in os.listdir(dirName):
        if file.startswith("StreamingHistory"):
            streamingHistory.append(file)

    # Goes through all the "STREAMING HISTORY" files and places data into arrays
    for i in range(0,len(streamingHistory) - 7):
        #print("new file\n\n")
        abspath = os.path.abspath(dirName + "/" + streamingHistory[i])

        # Opens all files in the list with proper formating
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)

            # makes a dic for every year in songDict
            for item in data:
                songDict[item["endTime"][0:4]] = {}
                artistDict[item["endTime"][0:4]] = {}
            songDict["Total"] = {}
            artistDict["Total"] = {}
            
            # Opens the each "STREAMING HISTORY" file
            for item in data:
                
                # adds every song into dict
                # songDict[item["endTime"][0:4]].get(songArtist, 0)
                songArtist = (item["trackName"], item["artistName"])
                songDict[item["endTime"][0:4]][songArtist] = int(item["msPlayed"]) + songDict[item["endTime"][0:4]].get(songArtist,0)
                songDict["Total"][songArtist] = int(item["msPlayed"]) + songDict["Total"].get(songArtist, 0)

                # addes every artist into dict
                # artistDict[item["endTime"][0:4]].get(item["artistName"], 0)
                artistDict[item["endTime"][0:4]][songArtist[1]] = int(item["msPlayed"]) + artistDict[item["endTime"][0:4]].get(songArtist[1], 0)
                artistDict["Total"][songArtist[1]] = int(item["msPlayed"]) + artistDict["Total"].get(songArtist[1], 0)

    print("Finished Receiving Data")

# TOP SONGS
# Returns the time one song is played across all years, songArtist is tuple (song, artist)
def findSongTime(songArtist):
    return convertMilliseconds(songDict["Total"][songArtist])

# Returns the time one song is played in a year, songArtist is tuple (song, artist)
def findSongTimeYear(songArtist, year):
    return convertMilliseconds(songDict[year][songArtist])

# Returns top songs instances based on listening time in a year
def topSongTime(year, num):
    a = heapq.nlargest(num, songDict[year], key=songDict[year].get)
# Returns top songs instances based on listening time across all years
def topSongTime(num):
    list = heapq.nlargest(num, songDict["Total"], key=songDict["Total"].get)
    list2 = []
    for i in range(len(list)):
        list2.append(findSongTime((list[i][0], list[i][1])))
    return list, list2

# TOP ARTISTS
# Returns list of Artist Names from 0 to int
def findArtistTime(artist):
    for list in artistDict:
        a = a + (list[artist])
    return convertMilliseconds(a)

# Returns the time one song is played in of the years
def findArtistTime(artist, year):
    return(convertMilliseconds(artistDict[year][artist]))

# Returns top songs instances based on listening time in a year
def topArtistTime(year, num):
    a = heapq.nlargest(num, artistDict[year], key=artistDict[year].get)

# Returns top songs instances based on listening time across all years
def topArtistTime(num):
    list = heapq.nlargest(num, artistDict["Total"], key=artistDict["Total"].get)
    list2 = []
    for i in range(len(list)):
        list2.append(findArtistTime((list[i][0], list[i][1])))
    return list, list2

# TIME CALCULATIONS
# Converts miliseoncds to hours, minutes, and seconds
def convertMilliseconds(millis):
    hours = int(millis/3600000)
    minutes = int((millis % 3600000)/60000)
    seconds = round(((millis % 3600000)% 60000)/1000, 2)
    return ("{0} hours {1} mins {2} seconds".format(hours, minutes, seconds))

# Returns Total timed listened on spotify in string form (hours:minutes:seconds)
def totalTimeListened():
    for year in songDict:
        a = a + totalTimeListenedInYear(year)
    return convertMilliseconds(a)
    
# Returns Total time listened on in a year in string form (hours:minutes:seconds)
def totalTimeListenedInYear(year):
    for song in songDict[year]:
            a = a + songDict[year][song]
    return convertMilliseconds(a)

# Prints out all the songs
# Prints song name, artist, when it was listened to and the milseconds it was listened for
def printListAllSongs():
    for year in songDict:
        for song in songDict[year]:
            print(song[0] + " " + song[1] + " " + year + " " + convertMilliseconds(songDict[year][song]))