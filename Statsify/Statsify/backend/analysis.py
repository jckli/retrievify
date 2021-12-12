import json
import os

songDic = {}
yearList = []
found = False

# Converts milsecond time to mins
def convertMillitoMin(millis):
    minutes=(millis/(1000*60))
    return minutes

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
    for i in range(0,len(streamingHistory)):
        #print("new file\n\n")
        abspath = os.path.abspath(dirName + "/" + streamingHistory[i])

        # Opens all files in the list with proper formating
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)

            for item in data:
                    songDic[item["endTime"][0:4]] = {}
            
            print(songDic)
            # Opens the each "STREAMING HISTORY" file
            for item in data:
                songDic[item["endTime"][0:4]][(item["trackName"], item["artistName"])] = int(item["msPlayed"])

    print("Finished Receiving Data")


# Returns a list that contains all the songs in a given year from given list
def yearList(list, year):
    a = []
    for i in list:
        if(str(year) == i.endTime[0:4]):
            a.append(i)
    return a
 
# Returns top songs instances based on listening time
def topList(list, int):
    listA = []
    sort(listA)
    b = True
    for i in range(int):
        listA.append(list.pop(0))
    for i in list:
        for top in listA:
            if(i.milsec > top.milsec and b):
                listA.append(i)
                listA = sort(listA)
                listA.pop(int)
                b = False
        b = True
    listA = sort(listA)
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
    return totalTimeListened(yearList(list, year))

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

def sort(list):
    for i in range(0, len(list)):
        key_item = list[i]
        j = i - 1
        while j >= 0 and list[j].milsec < key_item.milsec:
            list[j + 1] = list[j]
            j -= 1
        list[j + 1] = key_item
    return list

# Returns the total milliseconds throughout the data given
def totalTime(list):
    milsec = 0
    for i in list:
        milsec += i.milsec
    return milsec

# Returns the total milliseconds throughout the data given, in a given year
def totalTimeInYear(list, year):
    milsec = 0
    for i in list:
        if(int(i.endTime[0:4]) == year):
            milsec += i.milsec
    return milsec

def totalTimeBySong(list, song):
    milsec = 0
    return milsec
