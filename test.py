from analysis import *

import tkinter
from tkinter import filedialog

root = tkinter.Tk()
root.withdraw()
dirname = filedialog.askdirectory(parent=root,initialdir="/",title="Select the MyData folder")

list = get_info(dirname)

print(totalTimeInYear(list, 2021))
