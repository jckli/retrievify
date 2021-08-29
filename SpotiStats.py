from analysis import get_info, yearSort, topTen, topTenInYear
from calculations import convertMillitoMin

import os
#import datetme
import tkinter
from tkinter import filedialog
from time import sleep
from os import system, name

# currentTime = datetime.datetime.utcnow()

# Start Up Menu
print("SpotiStats Beta v0.1")
print("Starting up.")
sleep(0.05)

# Get the path of the folder containing the files
root = tkinter.Tk()
root.withdraw()
dirname = filedialog.askdirectory(parent=root,initialdir="/",title="Select the MyData folder")

def print_songNames(list):
    for i in list:
        print(i.name)

print("Analyzing Data! Please wait.")
sleep(0.2)
list = get_info(dirname)

"""
historyLength = len(endTime)
endTime = [datetime.datetime.strptime(endTime[i], "%Y-%m-%d %H:%M") for i in range(historyLength)]
yearsTime = [endTime[i].year for i in range(historyLength)]

year2021 = sorted(i for i in yearsTime if i == 2021)
year2020 = sorted(i for i in yearsTime if i == 2020)
year2019 = sorted(i for i in yearsTime if i == 2019)

startLength2021 = historyLength - len(year2021)
startLength2020 = startLength2021 - len(year2020)
startLength2019 = startLength2020 - len(year2019)

msPlay2021 = 0
for i in range(startLength2021, historyLength):
    msPlay2021 = msPlay2021 + msPlayed[i]

msPlay2020 = 0
for i in range(startLength2020, startLength2021):
    msPlay2020 = msPlay2020 + msPlayed[i]

msPlay2019 = 0
for i in range(startLength2019, startLength2020):
    msPlay2019 = msPlay2019 + msPlayed[i]

timeListened2021 = convertMillitoMin(msPlay2021)
"""
def clear():
    if name == 'nt':
        _ = system('cls')
    else:
        _ = system('clear')
clear()
#print(f"Your minutes listened in 2021 is {timeListened2021:,.2f} minutes. That's a lot OwO")
input("Press enter to close program")