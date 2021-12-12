import json
import os
import heapq

songDic = {}
yearList = []
found = False

# Converts milsecond time to mins
#def convertMillitoMin(millis):
    #minutes=(millis/(60000))
    #return minutes

# Gets all the files and puts all the songs into classes instances 
# and into lists that contain total time played separated by years
def get_info(dirName):

     #item["trackName"] item["artistName"] and item["endTime"][0:4]

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

            # makes a dic for every year in songDic
            for item in data:
                songDic[item["endTime"][0:4]] = {}
            
            # Opens the each "STREAMING HISTORY" file
            for item in data:
                # adds every song into dic
               ms = songDic[item["endTime"][0:4]].get((item["trackName"], item["artistName"]), 0)
               songDic[item["endTime"][0:4]][(item["trackName"], item["artistName"])] = int(item["msPlayed"]) + ms
               #print(item["trackName"] + ", " + item["artistName"] + "for " + str(item["msPlayed"]) + " ms")

    print("Finished Receiving Data")

# Returns the time one song is played across all years
def findSongTime(song, artist):
    for list in songDic:
        a = a + (list[(song, artist)])
    return a
# Tuple search
def findSongTime(songArtist):
    for list in songDic:
        a = a + (list[songArtist])
    return a

# Returns the time one song is played in of the years
def findSongTime(song, artist, year):
    return(songDic[year][(song, artist)])
# Tuple search
def findSongTime(songArtist, year):
    return(songDic[year][songArtist])
 
# Returns top songs instances based on listening time in a year
def topSongTime(year, num):
    a = heapq.nlargest(num, songDic[year], key=songDic[year].get)

# Returns top songs instances based on listening time across all years
def topSongTime(num):
    for i in songDic:
        list2 = heapq.nlargest(num, songDic[i], key=songDic[i].get)
        #print(list2)
        print("For they year " + i)
        for a in list2:
            print(a[0] + " " + a[1] + " " + str(findSongTime(a,i)))
        print()

    #return heapq.nlargest(num, list, key=list.get)
    
# Returns list of Artist Names from 0 to int
def topIntArtistNames(list, int):
    print()

# Default List of top 10 Artist
def topArtistNames(list):
    print()

# Returns Total Milseconds listened on spotify
def totalTimeListened():
    for year in songDic:
        a = a + totalTimeListenedInYear(year)
    return a
    
# Returns Total milseconds listen on spotify, given year
def totalTimeListenedInYear(year):
    for song in songDic[year]:
            a = a + songDic[year][song]
    return a

# Prints the list with song name, artist, when it was listened to and the milseconds it was listened for
def printList(list):
    for i in list:
        
        # Print Option 1
        print(i.song + "        " + i.artist + "        " + i.endTime + "        " + str(i.milsec))
        
        # Print Option 2
        #print(i.song)
        #print(i.artist)
        #print(i.endTime)
        #print(str(i.milsec) + "\n")

def topList(list, artistCount):
    print()