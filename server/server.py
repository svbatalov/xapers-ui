#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, \
     render_template
from flask_cors import CORS

import argparse, os
from api import create_api

parser = argparse.ArgumentParser()
parser.add_argument('-r', '--xapers-root',
                    help="Xapers root directory", default="~/.xapers/docs")
parser.add_argument('--host', help="Host", default="0.0.0.0")
parser.add_argument('-p', '--port', help="Port", default=5000, type=int)

args = parser.parse_args()
args.xapers_root = os.path.join(os.path.expanduser(args.xapers_root), '')
print "Args:", args
app = Flask(__name__,
        static_folder="../client/dist",
        static_url_path="",
        template_folder="../client/dist")

CORS(app)

app.register_blueprint(create_api(args), url_prefix="/api")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    from eventlet import wsgi
    import eventlet
    wsgi.server(eventlet.listen((args.host, args.port)), app)
    #app.run()
