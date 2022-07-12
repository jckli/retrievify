import json
import zipfile

def get_info(zipfolder):
    songDict = {}
    artistDict = {}
    firstTime = ""
    currentYear = ""
    # Gets the number of "STREAMING HISTORY" files in the folder
    streamingHistory = []
    for file in zipfolder.namelist():
        if "StreamingHistory" in file:
            streamingHistory.append(file)

    # Makes dictonary for each individual song and artist total time
    songDict["Total"] = {}
    artistDict["Total"] = {}
    currentYear = ""

    # Goes through all the "STREAMING HISTORY" files and places data into arrays
    for i in range(0,len(streamingHistory)):
        raw_data = zipfolder.open(streamingHistory[i]).read()

        # Opens all files in the list with proper formating
        data = json.loads(raw_data)

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
            split = str(item["artistName"]).split(", ")
            for artist in split:
                artistDict[item["endTime"][0:4]][artist] = int(item["msPlayed"]) + artistDict[item["endTime"][0:4]].get(artist, 0)
                artistDict["Total"][artist] = int(item["msPlayed"]) + artistDict["Total"].get(artist, 0)
                
        print("Finished Receiving Data")
        return songDict, artistDict, firstTime, currentYear