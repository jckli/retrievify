import json
import os

class spotifyInfo:
    song = "Default"
    artist = "Default"
    milsec = 0
    endTime = 0

# Gets all the files and puts all the songs into classes instances 
# and into lists that contain total time played separated by years
def get_info(dirName):
    listA =  get_list(get_files(dirName), dirName)
    print("Finished Receiving Data")
    return listA
    #endTime = get_endTime(streamingHistory, dirname)

def get_files(dirName):
    streamingHistory = []
    for file in os.listdir(dirName):
        if file.startswith("StreamingHistory"):
            streamingHistory.append(file)
    return streamingHistory


def get_list(streamingHistory, dirname):
    listA = []
    dupIndicate = False

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
                    if(item["trackName"] == existing.name and item["artistName"] == existing.artist and item["endTime"][0:4] == existing.endTime[0:4]):
                        existing.milsec += item["msPlayed"]
                        dupIndicate = True
                
                # Creates new instance for non existing songs
                if(not dupIndicate):
                    a = spotifyInfo()
                    a.song = item["trackName"]
                    a.artist = item["artistName"]
                    a.endTime = item["endTime"]
                    a.milsec = item["msPlayed"]
                    listA.append(a)

                # Resets dulplicate indicator
                dupIndicate = False
    return listA

    # Returns a list that contains all the songs in a given year
    def yearSort(list, year):
        a = []
        for i in list:
            if(year == i.endTime[0:4]):
                a.append(i)
        return a
    
    # Returns Top number of Songs based on time from list
    def topList(list, int):
        listA = []
        for i in list:
            for top in listA:
                if( i.milsec > top.milsec and len(listA) >= int):
                    listA.append(i)
                    sorted(listA)
                    listA.pop()
                elif(len(listA) < int):
                    listA.append(i)
        return listA

    # Returns list of Top Int Song Names
    def topIntSongNames(list,int):
        listA = topList(list, int)
        listB = []
        for i in listA:
            listB.append(i.song)
        return listB

    # Defaults to top 10 Song Names
    def topSongNames(list):
        return topIntSongNames(list, 10)
    
    # Returns the name of the top 10 artist names
    def topIntArtistNames(list, int):
        listA = topList(list, int)
        listB = []
        for i in listA:
            listB.append(i.artist)
        return listB

    # Defaults to top 10 Artist Names
    def topArtistNames(list):
        return topIntArtistNames(list, 10)

    # Returns Total milseconds listen on spotify
    def totalTimeListened(list):
        a = 0
        for i in list:
            a += i.milsec
        return a
    
    # Returns Total milseconds listen on spotify for a given year
    def totalTimeListenedInYear(list, year):
        return totalTimeListened.yearSort(list, year)

    def convertMillitoMin(millis):
        minutes=(millis/(1000*60))
        return minutes
