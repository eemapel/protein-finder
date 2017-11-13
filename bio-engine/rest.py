#!/usr/bin/env python

import sys
import requests as sender
from flask import Flask, abort, request 
import json
from time import sleep
import threading

from protein import Protein

app = Flask(__name__)

#Entrez.email = "noreply@noreply.na"

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

def query_engine(port):
    sleep(5)
    data = dict(name='joe', age='10')
    sender.put('http://localhost:' + port, data=dict(reply='1'))
    sleep(5)
    sender.put('http://localhost:' + port, data=dict(reply='2'))
    sleep(5)
    print "Deleting connection at port", port
    sender.delete('http://localhost:' + port)

@app.route('/', methods=['POST']) 
def foo():
    if not request.json:
        abort(400)
    print request.json
    port = str(request.json["port"])

    t = threading.Thread(target=query_engine, args=(port,))
    t.start()
 
    return "OK"

if __name__ == '__main__':
    p = Protein(sys.argv[1:])

    # Show loaded proteins
    p.print_names()

    # Start server appliance
    app.run(host='0.0.0.0', port=7000, debug=True)
