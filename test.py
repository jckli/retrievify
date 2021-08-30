from analysis import *

import tkinter
from tkinter import filedialog

root = tkinter.Tk()
root.withdraw()
dirname = filedialog.askdirectory(parent=root,initialdir="/",title="Select the MyData folder")

list = get_info(dirname)
print("Pulled Info")
listA = topList(list, 10)
printList(list)
print("\nTop List is \n\n")
printList(listA)
print("Finished")
#printList(list)