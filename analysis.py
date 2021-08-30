import json
import os

class spotifyInfo:
    song = "Default"
    artist = "Default"
    milsec = 0
    endTime = 0
    timeList = []

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
    dupIndicate = True

    # Goes through all the files
    for i in range(0,len(streamingHistory) - 1):
        #print("new file\n\n")
        abspath = os.path.abspath(dirname + "/" + streamingHistory[i])

        # Opens all files in the list with proper formating
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                #print("new item\n")

                # Checks for Duplicates and adds time
                for existing in listA:
                    if(item["trackName"] == existing.song and item["artistName"] == existing.artist):
                        if(item["endTime"][0:4] == existing.endTime[0:4]):
                            existing.milsec = existing.milsec + int(item["msPlayed"])
                            dupIndicate = False
                        elif(dupIndicate):
                            a = spotifyInfo()
                            a.song = item["trackName"]
                            a.artist = item["artistName"]
                            a.endTime = item["endTime"]
                            a.milsec = int(item["msPlayed"])
                            listA.append(a)
                
                # Creates new instance for non existing songs
                if(dupIndicate):
                    a = spotifyInfo()
                    a.song = item["trackName"]
                    a.artist = item["artistName"]
                    a.endTime = item["endTime"]
                    a.milsec = int(item["msPlayed"])
                    listA.append(a)

                # Resets dulplicate indicator for the next item in list
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

"""   
# Returns top songs instances based on listening time
def topList(list, int):
    listA = [list[0],list[1]]
    b = True
    for i in list:
        for top in listA:
            if( i.milsec > top.milsec and len(listA) >= int and b):
                listA.append(i)
                listA = removeLowestTime(listA)
                printList(listA)
                b = False
            elif(len(listA) < int):
                listA.append(i)
    print("-----------------------------------------")
    b = True
    return listA
"""
# Returns top songs instances based on listening time
def topList(list, int):
    listA = []
    for i in range(int):
        listA.append(list[i])
    for i in list:
        for a in listA:
            if i.milsec > a.milsec:
                listA.append(i)
                if len(listA) > 10: removeLowestTime(listA)
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

def printList(list):
    for i in list:
        print(i.song + "\n")
        print(i.artist + "\n")
        print(i.endTime + "\n")
        print(str(i.milsec) + "\n\n")
    """
    print(list[0].song + "\n")
    print(list[0].artist + "\n\n")
    print(list[1].song + "\n")
    print(list[1].artist + "\n\n")
    print(list[2].song + "\n")
    print(list[2].artist + "\n\n")
    print(list[3].song + "\n")
    print(list[3].artist + "\n\n")
    """

def removeLowestTime(list):
    a = list[0].milsec
    b = 0
    for i in range(len(list) - 1):
        if a < list[i].milsec:
            a = list[i].milsec
            b = i
    list.pop(b)
    return list