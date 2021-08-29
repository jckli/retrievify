import json
import os

class spotifyInfo:
    name = "Default"
    artist = "Default"
    milsec = 0
    endTime = 0

# Gets all the files and puts all the songs into classes instances 
# and into lists that contain total time played separated by years
def get_info(dirname):
    list =  get_list(get_files(dirname), dirname)
    print("Finished Receiving Data")
    return list
    #endTime = get_endTime(streamingHistory, dirname)

def get_files(dirname):
    streamingHistory = []
    for file in os.listdir(dirname):
        if file.startswith("StreamingHistory"):
            streamingHistory.append(file)
    return streamingHistory


def get_list(streamingHistory, dirname):
    list = []
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
                for existing in list:
                    if(item["trackName"] == existing.name and item["artistName"] == existing.artist and item["endTime"][0:4] == existing.endTime[0:4]):
                        existing.milsec += item["msPlayed"]
                        dupIndicate = True
                
                # Creates new instance for non existing songs
                if(not b):
                    a = spotifyInfo()
                    a.name = item["trackName"]
                    a.artist = item["artistName"]
                    a.endTime = item["endTime"]
                    a.milsec = item["msPlayed"]
                    list.append(a)

                # Resets dulplicate indicator
                dupIndicate = False