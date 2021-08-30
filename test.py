from analysis import *

import tkinter
from tkinter import filedialog

root = tkinter.Tk()
root.withdraw()
dirname = filedialog.askdirectory(parent=root,initialdir="/",title="Select the MyData folder")

list = get_info(dirname)

for i in list:
    with open("fuck.txt", "w", encoding="utf-8") as f:
        f.write(i.song + "\n")
