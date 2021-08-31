from analysis import *

from os import system, name

def clear():
    if name == 'nt':
        _ = system('cls')
    else:
        _ = system('clear')

def choices(list, userInput):
    if userInput == "1":
        clear()
        songCount = int(input("How many songs (default 10): ") or 10)
        songList = topList(list, songCount)
        print("Top Songs")
        print("----------------")
        for i in range(songCount):
            print(f"{i + 1}. {songList[i].song} - {songList[i].milsec}")
        print("----------------")
        input("Press Enter to Go Back...")
        clear()