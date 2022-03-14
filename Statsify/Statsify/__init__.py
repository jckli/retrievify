"""
The flask application package.
"""

from flask import Flask
app = Flask(__name__)

dp = ""

import Statsify.views
