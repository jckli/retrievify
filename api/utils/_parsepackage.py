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
    songDict["Total"] = {"All": {}, "Songs": {}}
    artistDict["Total"] = {}
    currentYear = ""

    # Goes through all the "STREAMING HISTORY" files and places data into arrays
    for i in range(0, len(streamingHistory)):
        raw_data = zipfolder.open(streamingHistory[i]).read()

        # Opens all files in the list with proper formating
        data = json.loads(raw_data)

        if i == 0:
            firstTime = str(data[0]["endTime"][0:10])

        # Opens the each "STREAMING HISTORY" file
        for item in data:

            # makes a dictionary for every year in songDict
            if currentYear[0:4] != item["endTime"][0:4]:
                currentYear = item["endTime"][0:10]
                songDict[currentYear[0:4]] = {}
                artistDict[currentYear[0:4]] = {}
                songDict["Total"]["All"][currentYear[0:4]] = 0

            # adds every song into the songDict
            # songDict[year][(song, artist)] = time
            songDict["Total"]["All"][item["endTime"][0:4]] += int(item["msPlayed"])

            songArtist = (item["trackName"], item["artistName"])
            eachSongDict = {
                "Time": int(item["msPlayed"]),
                "Song": item["trackName"],
                "Artist": item["artistName"],
            }
            if songArtist in songDict["Total"]["Songs"]:
                songDict["Total"]["Songs"][songArtist]["Time"] += int(item["msPlayed"])
            else:
                songDict["Total"]["Songs"][songArtist] = eachSongDict

            if songArtist in songDict[item["endTime"][0:4]].keys():
                # Just adds the time
                songDict[item["endTime"][0:4]][songArtist] = songDict[
                    item["endTime"][0:4]
                ].get(songArtist[0], 0) + int(item["msPlayed"])
            else:
                # Adds the song to the songDict
                songDict[item["endTime"][0:4]][songArtist] = eachSongDict

            # addes every artist into the artistDict
            # artistDict[year][artist] = time
            split = str(item["artistName"]).split(", ")
            for artist in split:
                if artist not in artistDict["Total"]:
                    artistDict["Total"][artist] = 0
                artistDict["Total"][artist] += int(item["msPlayed"])
                if artist in artistDict[item["endTime"][0:4]].keys():
                    # Just adds the time
                    artistDict[item["endTime"][0:4]][artist] = artistDict[
                        item["endTime"][0:4]
                    ][artist] + int(item["msPlayed"])
                else:
                    # Adds the artist to the artistDict
                    artistDict[item["endTime"][0:4]][artist] = int(item["msPlayed"])

        print("Finished Receiving Data")

    newSongDict = {"Total": {"All": {}, "Songs": []}}
    for year in songDict:
        if year == "Total":
            newSongDict["Total"]["All"] = songDict["Total"]["All"]
            for song in songDict["Total"]["Songs"]:
                newSongDict["Total"]["Songs"].append(songDict["Total"]["Songs"][song])
        else:
            newSongDict[year] = []
            for song in songDict[year]:
                newSongDict[year].append(songDict[year][song])

    return newSongDict, artistDict, firstTime, currentYear
