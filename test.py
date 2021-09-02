from analysis import *

import tkinter
from tkinter import filedialog

root = tkinter.Tk()
root.withdraw()
dirname = filedialog.askdirectory(parent=root,initialdir="/",title="Select the MyData folder")

list = get_info(dirname)

print("\n")
listB = yearList(list, 2020)
listA = topList(listB, 25)

print("           Top Songs            ")
print("--------------------------------")
printList(listA)
a = totalTimeInYear(listB, 2020)
print("\n")
print(" Time Listened to Music in 2020 ")
print("--------------------------------")
print("\n" + str(a) + " milseconds or ")
print(str(a/1000) + " seconds or")
print(str(a/60000) + " mins or")
print(str(a/3600000) + " hours or")
print(str(a/86400000) + " days or")
print(str(a/31557600000) + " years")

