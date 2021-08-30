from analysis import *

from os import system, name

def clear():
    if name == 'nt':
        _ = system('cls')
    else:
        _ = system('clear')

def choices(userInput):
    if userInput == "1":
        clear()
        songCount = input("How many songs (default 10): ")
        if songCount == "":
            songCount = 10
        songList = topIntSongNames(list, songCount)
        print("Top Songs")
        print("----------------")
        # for i in range(songCount):
        print(songList)
        print("----------------")
        input("Press Enter to Go Back...")
        clear()
