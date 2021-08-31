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
            minutes = convertMillitoMin(songList[i].milsec)
            print(f"{i + 1}. {songList[i].song} - {minutes:,.2f} minutes")
        print("----------------")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "2":
        clear()
        artistCount = int(input("How many artists (default 10): ") or 10)
        artistList = topList(list, artistCount)
        print("Top Artists")
        print("----------------")
        for i in range(artistCount):
            print(f"{i + 1}. {artistList[i].artist} - {artistList[i].milsec}")
        print("----------------")
        input("Press Enter to Go Back...")
        clear()
