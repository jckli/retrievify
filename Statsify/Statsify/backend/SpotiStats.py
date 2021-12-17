from analysis import *
from outputs import choices

import os
#import datetme
import tkinter
from tkinter import filedialog
from time import sleep
from os import system, name
import json

# Start Up Menu
print("SpotiStats v1")
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
#clear()

#print("First Time instance: " + firstTime)
#print("Last Time instance: " + currentYear)

#print(f"Your minutes listened in 2021 is {timeListened2021:,.2f} minutes. That's a lot OwO")
print("~ What would you like to see?")
print("1. Top Songs")
print("2. Top Artists")
print("3. Top Genre (Not working - prolly gonna use api)")
print("4. Total Time Listened on Spotify")
print("5. Total Time Listened in a Year")
print("6. Total Time Listened to Song")
print("7. Total Time Listened to Song in a Year")
print("8. Total Time Listened to Artist")
print("9. Total Time Listened to Artist in a Year")
print("10. Starting Date of Data")
#print("10. Number of Time Song is Played (Not working)")
#print("11. Number of Time Song is Played in a Year (Not working)")
#print("12. Number of Time Artist is Played (Not working)")
#print("13. Number of Time Artist is Played in a Year (Not working)")


userInput = input("Enter a Number: ")
choices(list, userInput)