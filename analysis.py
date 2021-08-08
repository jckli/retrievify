import json
import os

def get_files(dirname):
    streamingHistory = []
    for file in os.listdir(dirname):
        if file.startswith("StreamingHistory"):
            streamingHistory.append(file)
    return streamingHistory

def get_msPlayed(streamingHistory, dirname):
    msPlayed = []
    i = 0
    while (i <= len(streamingHistory) - 1):
        abspath = os.path.abspath(dirname + "/" + streamingHistory[i])
        with open(abspath, "r",  encoding='utf-8') as f:
            data = json.load(f)
            for item in data: 
                msPlayed.append(item["msPlayed"])
        i += 1   
    return msPlayed

def get_endTime(streamingHistory, dirname):
    endTime = []
    i = 0
    while (i <= len(streamingHistory) - 1):
        abspath = os.path.abspath(dirname + "/" + streamingHistory[i])
        with open(abspath, "r", encoding='utf-8') as f:
            data = json.load(f)
            for item in data: 
                endTime.append(item["endTime"])
        i += 1
    return endTime