#!/usr/bin/env python

import sys
import requests as sender
from flask import Flask, abort, request 
import json
from time import sleep
import threading

from protein import Protein

# Globals
app = Flask(__name__)
p = Protein("NC_000852,NC_007346,NC_008724,NC_009899,NC_014637,NC_020104,NC_023423,NC_023640,NC_023719,NC_027867")

# Design
# ------
# bio-engine (port 7000)        web-app (ports 8000-)
#     |                                  |
#     |                               (open port)
#     |  <---- POST (sequence) --------  |
#     |  ----- PUT (found protein) --->  |
#     |  ----- PUT (found protein) --->  |
#     |  ----- DELETE (finished) ----->  |
#     |                               (close port)

def match_provider(port, sequence):
    protein_codes = p.get_code_list()

    for code in protein_codes:
        if p.check_sequence_alignment(code, sequence):
            # Some unnecessary artificial delay just to emphasize rendering on UI
            sleep(2)
            sender.put('http://localhost:' + port, data=dict(reply=p.get_name(code)))

    print "Removing connection to port", port
    sender.delete('http://localhost:' + port)

@app.route('/', methods=['POST']) 
def post_handler():
    if not request.json:
        abort(400)

    print "POST request received with:", request.json
    port = str(request.json["port"])
    sequence = request.json["sequence"]

    t = threading.Thread(target=match_provider, args=(port, sequence,))
    t.start()
 
    return "OK"

if __name__ == '__main__':

    print "Loaded proteins:"
    p.print_names()

    # Start server appliance
    app.run(host='0.0.0.0', port=7000, debug=True)
