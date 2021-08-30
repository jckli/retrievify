from analysis import *

import os
#import datetme
import tkinter
from tkinter import filedialog
from time import sleep
from os import system, name
import json

# Start Up Menu
print("SpotiStats v0.2")
print("Starting up.")
sleep(0.05)

# Get the path of the folder containing the files
root = tkinter.Tk()
root.withdraw()
dirname = filedialog.askdirectory(parent=root,initialdir="/",title="Select the MyData folder")

print("Analyzing Data! Please wait.")

def print_songNames(list):
    list = []
    for i in list:
        list.append(i.name)
    return list
        
def clear():
    if name == 'nt':
        _ = system('cls')
    else:
        _ = system('clear')

list = get_info(dirname)
sleep(1)
clear()

#print(f"Your minutes listened in 2021 is {timeListened2021:,.2f} minutes. That's a lot OwO")
print("~What would you like to see?~")
print("1. Top Songs")
print("2. Top Artists")
print("3. Top Genre (utilize api)")
print("3. Total Time Listened")
print("4. Total Time Listened by Year")
print("5. Total Time Listened by Song")

userInput = input("Enter a Number: ")
if userInput == "1":
    clear()
    songCount = input("How many songs: ")
    if songCount == "":
        songCount = 10


    print("Top Songs")
    print("----------------")
    for i in range(10):
        print(f"{i+1}. {list[i].name}")
    print("----------------")
    input("Press Enter to Go Back...")
    clear()
elif userInput == "2":
    clear()
    print("Top Artists")
    print("----------------")
    for i in range(10):
        print(f"{i+1}. {list[i].artist}")
    print("----------------")
    input("Press Enter to Go Back...")
    clear()
elif userInput == "3":
    clear()
    print("Total Time Listened")
    print("----------------")
    print(f"You've spent {convertMillitoMin(list[0].msPlayed)} listening to music starting from *Beginning time*")
    print("----------------")
    input("Press Enter to Go Back...")
    clear()
