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
        songList, songTime = topSongTime(songCount)
        ("Top Songs")
        print("----------------")
        for i in range(songCount):
            #minutes = convertMillitoMin(findSongTime(songList[i]))
            #print(f"{i + 1}. {songList[i].song} - {minutes:,.2f} minutes")
            print(str(i+1) + ". " + songList[i][0] + " - " + songList[i][1] + " - " + convertMilliseconds(int(songTime[i])))
        print("----------------")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "2":
        clear()
        artistCount = int(input("How many artists (default 10): ") or 10)
        print("Top Artists")
        print("----------------")
        artistList, artistTime = topArtistTime(artistCount)
        for i in range(artistCount):
            #print(f"{i + 1}. {artistList[i].artist} - {artistList[i].milsec}")
            print(artistList[i] + " - " + convertMilliseconds(int(artistTime[i])))
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
        #minutes = convertMillitoMin(totalTimeListened())
        print("Total Time Listened - Starting from " + getFirstTime())
        print("----------------")
        #print(f"{minutes:,.2f} minutes")
        print(convertMilliseconds(totalTimeListened()))
        print("----------------")
        input("Press Enter to Go Back...")
        clear()

    elif userInput == "5":
        clear()
        year = str(input("Year: "))
        if year == "":
            print ("No Year Selected")
            input("Press Enter to Go Back...")
            clear()
        else:
            clear()
            #minutes = convertMillitoMin(totalTimeListenedInYear(year))
            print(f"Total Time Listened in {year}")
            print("----------------")
            #print(f"{minutes:,.2f} minutes")
            print(convertMilliseconds(totalTimeListenedInYear(year)))
            print("----------------")
            input("Press Enter to Go Back...")
            clear()

    elif userInput == "6":
        clear()
        #print("This output is not completed yet! Check back later.")
        song, artist = input("Enter in song name and artist name separated by a ';' : ").split(";")
        print("----------------")
        print(song + " - "  + artist + " - " + convertMilliseconds(int(findSongTime(song, artist))))
        input("Press Enter to Go Back...")
        clear()
    
    elif userInput == "7":
        clear()
        #print("This output is not completed yet! Check back later.")
        song, artist, year = input("Enter in song name, artist name, and year separated by a ';' : ").split(";")
        print("----------------")
        print(song + " - "  + artist + " - " + year + " - " +convertMilliseconds(int(findSongTimeYear(song, artist, year))))
        input("Press Enter to Go Back...")
        clear()
    
    elif userInput == "8":
        clear()
        #print("This output is not completed yet! Check back later.")
        artist = input("Enter in artist name: ")
        print("----------------")
        print(artist + " - " + convertMilliseconds(int(findArtistTime(artist))))
        input("Press Enter to Go Back...")
        clear()
    
    elif userInput == "9":
        clear()
        #print("This output is not completed yet! Check back later.")
        artist, year = input("Enter in artist name and year separated by a ';' : ").split(";")
        print("----------------")
        print(artist + " - " + year + " - " +convertMilliseconds(int(findArtistTimeYear(artist, year))))
        input("Press Enter to Go Back...")
        clear()

# Converts miliseoncds to hours, minutes, and seconds
def convertMilliseconds(millis):
    hours = int(millis/3600000)
    minutes = int((millis % 3600000)/60000)
    seconds = round((millis% 60000)/1000, 2)
    return ("{0} hours {1} mins {2} seconds".format(hours, minutes, seconds))
    #reutrn [hours, minutes, seconds]
    #return str(millis)