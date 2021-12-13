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
        print("Top Songs")
        print("----------------")
        songList = topSongTime(songCount)
        #for i in range(songCount):
            #minutes = convertMillitoMin(findSongTime(songList[i]))
            #print(f"{i + 1}. {songList[i].song} - {minutes:,.2f} minutes")
        print("----------------")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "2":
        clear()
        artistCount = int(input("How many artists (default 10): ") or 10)
        print("Top Artists")
        print("----------------")
        artistList = topArtistTime(list, artistCount)
        #for i in range(artistCount):
            #print(f"{i + 1}. {artistList[i].artist} - {artistList[i].milsec}")
        print("----------------")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "3":
        clear()
        print("This output is not completed yet! Check back later.")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "4":
        clear()
        minutes = convertMillitoMin(totalTimeListened())
        print(f"Total Time Listened - Starting from {list[0].endTime}")
        print("----------------")
        print(f"{minutes:,.2f} minutes")
        print("----------------")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "5":
        clear()
        year = int(input("Year: "))
        if year == "":
            print ("No Year Selected")
            input("Press Enter to Go Back...")
            clear()
        else:
            clear()
            minutes = convertMillitoMin(totalTimeListenedInYear(year))
            print(f"Total Time Listened in {year}")
            print("----------------")
            print(f"{minutes:,.2f} minutes")
            print("----------------")
            input("Press Enter to Go Back...")
            clear()

    elif userInput == "6":
        clear()
        print("This output is not completed yet! Check back later.")
        input("Press Enter to Go Back...")
        clear()

# Converts milsecond time to mins
def convertMillitoMin(millis):
    minutes=(millis/(60000))
    return minutes