import json
import os

# Class that holds all info of the songs
class spotifyInfo:
    song = "Default"
    artist = "Default"
    milsec = 0
    endTime = 0
    timeList = []

# Time Class to hold duration and listing times of each song
class time:
    year = []
    date = []
    milsec = []

# Converts milsecond time to mins
def convertMillitoMin(millis):
    minutes=(millis/(1000*60))
    return minutes

# Gets all the files and puts all the songs into classes instances 
# and into lists that contain total time played separated by years
def get_info(dirName):
    listA =  get_list(get_files(dirName), dirName)
    print("Finished Receiving Data")
    return listA

# Gets the information into an array from files
def get_files(dirName):
    streamingHistory = []
    for file in os.listdir(dirName):
        if file.startswith("StreamingHistory"):
            streamingHistory.append(file)
    return streamingHistory

# PLaces all the information into classes
def get_list(streamingHistory, dirname):
    listA = []
    dupIndicate = False

    # Goes through all the files
    for i in range(0,len(streamingHistory)):
        #print("new file\n\n")
        abspath = os.path.abspath(dirname + "/" + streamingHistory[i])

        # Opens all files in the list with proper formating
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                #print("new item\n")

                # Checks for existing song and adds time
                for existing in listA:
                    if(dupIndicate and item["trackName"] == existing.song and item["artistName"] == existing.artist and item["endTime"][0:4] == existing.endTime[0:4]):
                        existing.milsec += int(item["msPlayed"])
                        dupIndicate = False
                # Creates new instance of class for new songs
                if(dupIndicate):
                    a = spotifyInfo()
                    a.song = item["trackName"]
                    a.artist = item["artistName"]
                    a.endTime = item["endTime"]
                    a.milsec = item["msPlayed"]
                    listA.append(a)

                # Resets duplicate indicator for the next item in list
                dupIndicate = True
    #printList(listA)
    return listA

# Returns a list that contains all the songs in a given year
def yearSort(list, year):
    a = []
    for i in list:
        if(year == i.endTime[0:4]):
            a.append(i)
    return a
 
# Returns top songs instances based on listening time
def topList(list, int):
    listA = []
    for i in range(int):
        listA.append(list.pop(0))
    b = True
    for i in list:
        for top in listA:
            if(i.milsec > top.milsec and len(listA) == int and b):
                listA.append(i)
                listA = removeLowestTime(listA)
                b = False
        b = True
    return listA

# Returns list of Song Names from 0 to int
def topIntSongNames(list,int):
    listA = topList(list, int)
    listB = []
    for i in listA:
        listB.append(i.song)
    return listB

# Default List of top 10 Songs
def topSongNames(list):
    return topIntSongNames(list, 10)
    
# Returns list of Artist Names from 0 to int
def topIntArtistNames(list, int):
    listA = topList(list, int)
    listB = []
    for i in listA:
        listB.append(i.artist)
    return listB

# Default List of top 10 Artist
def topArtistNames(list):
    return topIntArtistNames(list, 10)

# Returns Total Milseconds listened on spotify
def totalTimeListened(list):
    a = 0
    for i in list:
        a += i.milsec
    return a
    
# Returns Total milseconds listen on spotify, given year
def totalTimeListenedInYear(list, year):
    return totalTimeListened.yearSort(list, year)

# Prints the list with song name, artist, when it was listened to and the milseconds it was listened for
def printList(list):
    for i in list:
        print(i.song + "        " + i.artist + "        " + i.endTime + "        " + str(i.milsec))
        #print(i.artist + "\n")
        #print(i.endTime + "\n")
        #print("   " + str(i.milsec))

# Removes the lowest time from the list
def removeLowestTime(list):
    a = list[0].milsec
    b = 0
    for i in range(len(list)):
        if a < list[i].milsec:
            a = list[i].milsec
            b = i
    list.pop(i)
    return list

# Returns the total milliseconds throughout the data given
def totalTime(list):
    a = 0
    for i in list:
        a += i.milsec
    return a

