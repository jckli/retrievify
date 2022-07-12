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
print("Statsify v1.1")
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

#print("First Time instance: " + firstTime)
#print("Last Time instance: " + currentYear)

#print(f"Your minutes listened in 2021 is {timeListened2021:,.2f} minutes. That's a lot OwO")
choices(list)