import json
import os
import heapq

songDict = {}
artistDict = {}

# Converts milsecond time to mins
#def convertMillitoMin(millis):
    #minutes=(millis/(60000))
    #return minutes

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
            
            # Opens the each "STREAMING HISTORY" file
            for item in data:
                
                # adds every song into dict
                ms = songDict[item["endTime"][0:4]].get((item["trackName"], item["artistName"]), 0)
                songDict[item["endTime"][0:4]][(item["trackName"], item["artistName"])] = int(item["msPlayed"]) + ms
                
                # addes every artist into dict
                ms = artistDict[item["endTime"][0:4]].get(item["artistName"], 0)
                artistDict[item["endTime"][0:4]][item["artistName"]] = int(item["msPlayed"]) + ms
                #print(item["trackName"] + ", " + item["artistName"] + "for " + str(item["msPlayed"]) + " ms")

    print("Finished Receiving Data")

# TOP SONGS
# Returns the time one song is played across all years
def findSongTime(song, artist):
    for list in songDict:
        a = a + (list[(song, artist)])
    return convertMilliseconds(a)
# Tuple search version
def findSongTime(songArtist):
    for list in songDict:
        a = a + (list[songArtist])
    return convertMilliseconds(a)

# Returns the time one song is played in of the years
def findSongTime(song, artist, year):
    return(convertMilliseconds(songDict[year][(song, artist)]))
# Tuple search verison
def findSongTime(songArtist, year):
    return(convertMilliseconds(songDict[year][songArtist]))

# Returns top songs instances based on listening time in a year
def topSongTime(year, num):
    a = heapq.nlargest(num, songDict[year], key=songDict[year].get)
# Returns top songs instances based on listening time across all years
def topSongTime(num):
    for i in songDict:
        list2 = heapq.nlargest(num, songDict[i], key=songDict[i].get)
        #print(list2)
        print("For they year " + i)
        for a in list2:
            print(a[0] + " " + a[1] + " " + convertMilliseconds(findSongTime(a,i)))
        print()

    #return heapq.nlargest(num, list, key=list.get)

# TOP ARTISTS
# Returns list of Artist Names from 0 to int
def findArtistTime(artist):
    for list in artistDict:
        a = a + (list[artist])
    return convertMilliseconds(a)

# Returns the time one song is played in of the years
def findArtistTime(artist, year):
    return(convertMilliseconds(songDict[year][artist]))

# Returns top songs instances based on listening time in a year
def topArtistTime(year, num):
    a = heapq.nlargest(num, artistDict[year], key=artistDict[year].get)

# Returns top songs instances based on listening time across all years
def topArtistTime(num):
    for i in songDict:
        list2 = heapq.nlargest(num, artistDict[i], key=artistDict[i].get)
        #print(list2)
        print("For they year " + i)
        for a in list2:
            print(a[0] + " " + a[1] + " " + convertMilliseconds(findArtistTime(a,i)))
        print()

    #return heapq.nlargest(num, list, key=list.get)

# Returns top songs instances based on listening time across all years
def topSongTime(num):
    for i in songDict:
        list2 = heapq.nlargest(num, artistDict[i], key=artistDict[i].get)
        #print(list2)
        print("For they year " + i)
        for a in list2:
            print(a[0] + " " + a[1] + " " + convertMilliseconds(findArtistTime(a,i)))
        print()

    #return heapq.nlargest(num, list, key=list.get)

# TIME CALCULATIONS
# Converts miliseoncds to hours, minutes, and seconds
def convertMilliseconds(millis):
    seconds=(millis/1000)%60
    minutes=(millis/(1000*60))%60
    hours=(millis/(1000*60*60))%24
    return ("{0}:{1}:{2}".format(hours, minutes, seconds))

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